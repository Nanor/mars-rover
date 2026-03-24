import { Client, type Item, type MessageNode, type Player } from 'archipelago.js';

type ArchipelagoClientConfig = {
  player: string;
  password?: string;
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

export const createClient = () => {
  let clients: { client: Client; disconnect: () => void }[] = [];

  const messages = $state<Record<string, MessageNode[][]>>({});
  const players = $state<Record<string, Player>>({});
  const connections = $state<string[]>([]);
  const items = $state<ReceivedItem[]>([]);

  const connect = ({ player, host, password }: ArchipelagoClientConfig) => {
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
    };

    const handleAliasUpdated = (player: Player) => {
      players[player.name] = player;
    };

    const client = new Client();
    client
      .login(host, player, '', {
        tags: ['tracker', 'mars-rover'],
        password: password || '',
      })
      .then(async () => {
        messages[player] = [];
        client.messages.on('message', handleMessage);

        Object.keys(client.players.slots).forEach(([key]) => {
          const player = client.players.findPlayer(Number(key));
          if (player) {
            players[player.name] = player;
          }
        });
        client.players.on('aliasUpdated', handleAliasUpdated);

        handleItemsReceived(client.items.received, 0);
        client.items.on('itemsReceived', handleItemsReceived);

        connections.push(player);
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
  };
};
