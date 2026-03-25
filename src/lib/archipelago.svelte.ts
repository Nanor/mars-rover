import { Client, type DataPackage, type Item, type MessageNode, type Player } from 'archipelago.js';
import { SvelteSet } from 'svelte/reactivity';

export type ArchipelagoClientConfig = {
  player: string;
  password: string;
  host: string;
};

export type ReceivedItem = {
  id: number;
  receiver: string;
  name: string;
  orderReceived: number;
  filler: boolean;
  useful: boolean;
  progression: boolean;
  trap: boolean;
};

const saveToStorage = (type: string, seed: string, data: object) => {
  localStorage.setItem(`${type}-${seed}`, JSON.stringify(data));
};

const loadFromStorage = <T>(type: string, seed: string): T | null => {
  const str = localStorage.getItem(`${type}-${seed}`);
  if (str) {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  return null;
};

export const createClient = () => {
  let clients: { client: Client; disconnect: () => void }[] = [];
  let seed: string;

  const messages = $state<Record<string, MessageNode[][]>>({});
  const players = $state<Record<string, Player>>({});
  const connections = $state<string[]>([]);
  const items = $state<ReceivedItem[]>([]);

  let connected = $state(false);

  const connect = ({ player, host, password }: ArchipelagoClientConfig) => {
    if (connections.includes(player)) return;

    const handleMessage = (_: string, nodes: MessageNode[]) => {
      messages[player].push(nodes);
    };

    const handleItemsReceived = (is: Item[], startingIndex: number): void => {
      let index = startingIndex;
      for (const item of is) {
        const added = items.some(
          (i) => i.receiver === item.receiver.name && i.orderReceived === index
        );

        if (!added) {
          items.push({
            id: item.id,
            receiver: item.receiver.name,
            name: item.name,
            orderReceived: index,
            filler: item.filler,
            useful: item.useful,
            progression: item.progression,
            trap: item.trap,
          });
        }

        index += 1;
      }

      saveToStorage('items', client.room.seedName, items);
    };

    const handleAliasUpdated = (player: Player) => {
      players[player.name] = player;
    };

    const client = new Client();
    client.options.autoFetchDataPackage = false;
    client
      .login(clients?.[0]?.client.socket.url || host, player, '', {
        tags: ['tracker', 'mars-rover'],
        password: password || '',
      })
      .then(async () => {
        connected = true;
        seed = client.room.seedName;

        messages[player] = [];
        client.messages.on('message', handleMessage);

        const dataPackage = loadFromStorage<DataPackage>('dataPackage', seed);
        if (dataPackage) {
          client.package.importPackage(dataPackage);
        }
        await client.package.fetchPackage();
        saveToStorage('dataPackage', seed, client.package.exportPackage());

        Object.keys(client.players.slots).forEach(([key]) => {
          const player = client.players.findPlayer(Number(key));
          if (player) {
            players[player.name] = player;
          }
        });
        client.players.on('aliasUpdated', handleAliasUpdated);

        if (items.length === 0) {
          const is = loadFromStorage<ReceivedItem[]>('items', seed);
          if (is) {
            items.push(...is);
          }
        }
        handleItemsReceived(client.items.received, 0);
        client.items.on('itemsReceived', handleItemsReceived);

        connections.push(player);

        const savedConnections = loadFromStorage<string[]>('connections', seed);
        if (savedConnections) {
          const allConnections = new SvelteSet([...connections, ...savedConnections]);
          for (const c of allConnections) {
            connect({ player: c, host: client.socket.url, password });
          }
        }

        saveToStorage('connections', seed, connections);
      })
      .catch(console.error);

    const disconnect = () => {
      client.messages.off('message', handleMessage);
      client.items.off('itemsReceived', handleItemsReceived);
      client.players.off('aliasUpdated', handleAliasUpdated);

      client.socket.disconnect();
    };

    clients.push({ client, disconnect });
  };

  const disconnect = () => {
    for (const { disconnect } of clients) {
      disconnect();
    }
    clients = [];
    items.splice(0, items.length);
    connections.splice(0, connections.length);
    Object.keys(players).forEach((player) => delete players[player]);
    Object.keys(messages).forEach((player) => delete messages[player]);
    connected = false;
  };

  return {
    connect,
    disconnect,
    get messages() {
      return messages;
    },
    get players() {
      return players;
    },
    get items() {
      return items;
    },
    get connections() {
      return connections;
    },
    get connected() {
      return connected;
    },
    addPlayer: (player: string) => {
      if (clients.length === 0) {
        throw new Error('Call connect first');
      }
      connect({
        player,
        host: clients[0].client.socket.url,
        password: clients[0].client.arguments.password,
      });
    },
    removePlayer: (player: string) => {
      for (const { client, disconnect } of clients) {
        if (client.name === player) {
          disconnect();
        }
      }
      clients = clients.filter((c) => c.client.name !== player);
      connections.splice(connections.indexOf(player), 1);
      saveToStorage('connections', seed, connections);
      delete messages[player];
    },
  };
};
