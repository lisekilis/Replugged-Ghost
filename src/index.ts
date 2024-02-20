import { Injector, Logger, common } from "replugged";
const inject = new Injector();
const logger = Logger.plugin("Replugged-Ghost");
interface HTTPResponse<T = Record<string, unknown>> {
  body: T;
  headers: Record<string, string>;
  ok: boolean;
  status: number;
  text: string;
}
function getRandomContent(): string {
  const usr = common.users.getCurrentUser();
  const content: string[] = [
    "Hello mr. Message Logger",
    "These damn message loggers!",
    "Get pinged lol",
    `🤔`,
    `🤨`,
    `😎`,
    `Heyyyyyy ;)`,
    `(❀❛ ֊ ❛„)♡`,
    `(｡•ㅅ•｡)♡`,
    `<a:trolleyzoom:1014010020419080303>`,
    `<:skulley:1123454237519654912>`,
    `<a:crybabytroll:1003407307004182690>`,
    `<a:RaisedEyebrowLooking:1036763432176865341>`,
    `<:forg:1004880213081075772>`,
  ];
  if (usr.premium && common.users.isMember(`1000926524452647132`, usr.id)) {
    return content[Math.floor(Math.random() * 8)];
  } else return content[Math.floor(Math.random() * content.length - 1)];
}
// eslint-disable-next-line @typescript-eslint/require-await
export async function start(): Promise<void> {
  inject.utils.registerSlashCommand({
    name: "ghostping",
    description: "Allows you to ghost ping someone",
    options: [
      {
        name: "Who?",
        description: "Who doo you want to ping?",
        type: 6,
      },
    ],
    executor: async (interaction) => {
      const user = interaction.getValue("Who?")!;
      if (user) {
        const channelID = common.channels.getChannelId()!;
        let message = {
          content: `<@${user}>`,
          validNonShortcutEmojis: [],
        };
        const response = (await common.messages.sendMessage(channelID, message)) as HTTPResponse<{
          id: string;
        }>;
        logger.log(response);
        message.content = getRandomContent();
        void common.messages.editMessage(channelID, response.body.id, message);
        void common.messages.deleteMessage(channelID, response.body.id);
        return {
          send: false,
          result: `Ghost pinged <@${user}>`,
        };
      }
      return {
        send: false,
        result: `No user provided!`,
      };
    },
  });
}

export function stop(): void {
  inject.uninjectAll();
}
