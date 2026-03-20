import { Client, type Item, type MessageNode, type NetworkSlot } from 'archipelago.js';

type ArchipelagoClientConfig = {
  player: string;
  password?: string;
  host: string;
};

export type Player = NetworkSlot & {
  id: number;
  connected: boolean;
};

export const createClient = () => {
  let clients: { client: Client; disconnect: () => void }[] = [];

  const messages = $state<Record<string, MessageNode[][]>>({});
  const players = $state<Record<string, Player>>({});
  const items = $state<Item[]>([]);

  const connect = ({ player, host, password }: ArchipelagoClientConfig) => {
    messages[player] = [];

    const handleMessage = (_: string, nodes: MessageNode[]) => {
      messages[player].push(nodes);
    };
    const handleItemsReceived = (is: Item[]): void => {
      items.push(...is);
    };

    const client = new Client();
    client
      .login(host, player, password || '', {
        tags: ['tracker', 'mars-rover'],
      })
      .then(async () => {
        client.messages.on('message', handleMessage);

        Object.entries(client.players.slots).forEach(([id, p]) => {
          players[id] = {
            id: Number(id),
            connected: p.name === player || players[id]?.connected,
            ...p,
          };
        });

        items.push(...client.items.received);
        client.items.on('itemsReceived', handleItemsReceived);
      })
      .catch(console.error);

    const disconnect = () => {
      client.messages.off('message', handleMessage);
      client.items.off('itemsReceived', handleItemsReceived);

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
  };
};
