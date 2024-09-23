import { Injector, Logger, common, components, types, util } from "replugged";
import { cfg } from "./config";
const inject = new Injector();
const { ContextMenuTypes } = types;

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
  inject.utils.addMenuItem(ContextMenuTypes.TextareaContext, () => {
    const silence = cfg.get("silence", false);
    const item = {
      id: "messageSilenceToggle",
      label: `Silence Messages`,
      checked: silence,
      action: () => {
        cfg.set("silence", !silence);
        util.forceUpdateElement("[id=textarea-context]");
      },
      type: components.ContextMenu.MenuCheckboxItem,
    };
    return item;
  });
  inject.before(common.messages, "sendMessage", (args) => {
    if (args[1].content.indexOf("@silent") != 1 && cfg.get("silence", false)) {
      args[1].content = `@silent ${args[1].content}`;
    }
    return args;
  });
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
        logger.log(common.messages.getMessage(channelID, response.body.id));
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
