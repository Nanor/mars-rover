import {
  Client,
  clientStatuses,
  type Item,
  type MessageNode,
  type NetworkSlot,
} from 'archipelago.js';

type ArchipelagoClientConfig = {
  player: string;
  host: string;
};

export type Player = NetworkSlot & {
  id: number;
};

export const createClient = () => {
  const client = new Client();

  const log = $state<MessageNode[][]>([]);
  const players = $state<Player[]>([]);
  const items = $state<Item[]>([]);

  const connect = (config: ArchipelagoClientConfig) => {
    client
      .login(config.host, config.player, '', {
        tags: ['tracker'],
      })
      .then(async () => {
        client.messages.on('message', (_, nodes) => {
          log.push(nodes);
        });

        players.push(
          ...Object.entries(client.players.slots).map(([id, p]) => ({ id: Number(id), ...p }))
        );

        items.push(...client.items.received);

        client.items.on('itemsReceived', (is) => {
          items.push(...is);
        });
      })
      .catch(console.error);
  };

  const disconnect = () => {
    client.updateStatus(clientStatuses.disconnected);
  };

  return {
    connect,
    disconnect,
    get log() {
      return log;
    },
    get players() {
      return players;
    },
    get items() {
      return items;
    },
  };
};
