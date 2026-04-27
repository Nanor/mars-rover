import type { DataPackage, NetworkHint, SetReplyPacket } from 'archipelago.js/src/api';
import { Client, Hint, type Item, type MessageNode, type Player } from 'archipelago.js/src/index';
import { SvelteSet } from 'svelte/reactivity';

export type ArchipelagoClientConfig = {
  player: string;
  password: string;
  host: string;
};

export type ReceivedItem = {
  id: number;
  receiver: string;
  orderReceived: number;
  filler: boolean;
  useful: boolean;
  progression: boolean;
  trap: boolean;
  game: string;
  groups: string[];
};

export type { Hint, Player, MessageNode } from 'archipelago.js/src/index';
export { HintStatus } from 'archipelago.js/src/api';

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
  const hints = $state<Hint[]>([]);
  const allGroups = $state<string[]>([]);

  let connected = $state(false);

  const connect = ({ player, host, password }: ArchipelagoClientConfig) => {
    if (clients.find((c) => c.client.name === player)) return;

    let groups: Record<string, string[]>;

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
            orderReceived: index,
            filler: item.filler,
            useful: item.useful,
            progression: item.progression,
            trap: item.trap,
            game: item.game,
            groups: Object.entries(groups)
              .filter(([_k, v]) => v.includes(item.name))
              .map(([k]) => k),
          });
        }

        index += 1;
      }

      saveToStorage('items', client.room.seedName, items);
    };

    const handleAliasUpdated = (player: Player) => {
      players[player.name] = player;
    };

    const handleHints = (hs: Hint[]) => {
      for (const hint of hs) {
        const existingIndex = hints.findIndex(
          (h) =>
            h.item.locationId === hint.item.locationId &&
            h.item.sender.slot === hint.item.sender.slot
        );

        if (existingIndex !== -1) {
          hints.splice(existingIndex, 1, hint);
        } else {
          hints.push(hint);
        }
      }
    };
    const handleSetReply = (packet: SetReplyPacket): void => {
      if (packet.key === `_read_hints_${client.players.self.team}_${client.players.self.slot}`) {
        const hints = packet.value as NetworkHint[];
        handleHints(hints.map((h) => new Hint(client, h)));
      }
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

        const storedGroups = loadFromStorage<Record<string, string[]>>(
          `groups-${client.game}`,
          seed
        );
        if (storedGroups) {
          groups = storedGroups;
        } else {
          const data = await client.storage.fetchItemNameGroups(client.game);
          groups = Object.values(data)[0] as unknown as Record<string, string[]>;
          delete groups['Everything'];

          saveToStorage(`groups-${client.game}`, seed, groups);
        }

        for (const g of Object.keys(groups)) {
          if (!allGroups.includes(g)) {
            allGroups.push(g);
          }
        }

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

        handleHints(client.items.hints);
        client.items.on('hintsInitialized', handleHints);
        client.socket.on('setReply', handleSetReply);

        connections.push(player);

        const savedConnections = loadFromStorage<string[]>('connections', seed);
        if (savedConnections) {
          const allConnections = new SvelteSet([...connections, ...savedConnections]);
          for (const c of allConnections) {
            connect({ player: c, host: client.socket.url, password });
          }
        }

        saveToStorage('connections', seed, connections);

        client.socket.on('disconnected', () => {
          clients = clients.filter((c) => c.client.name !== player);
          if (clients.length === 0) {
            connected = false;
          }
        });
      })
      .catch(console.error);

    const disconnect = () => {
      client.messages.off('message', handleMessage);
      client.items.off('itemsReceived', handleItemsReceived);
      client.players.off('aliasUpdated', handleAliasUpdated);
      client.items.off('hintsInitialized', handleHints);
      client.socket.off('setReply', handleSetReply);

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
    get hints() {
      return hints;
    },
    get groups() {
      return allGroups;
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
      if (connections.includes(player)) {
        connections.splice(connections.indexOf(player), 1);
      }
      saveToStorage('connections', seed, connections);
      delete messages[player];
    },
    lookupItemName(game: string, id: number) {
      return clients[0].client.package.lookupItemName(game, id);
    },
  };
};
