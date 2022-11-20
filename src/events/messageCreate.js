const Event = require("../structures/Event.js");
const CommandContext = require("../structures/CommandContext.js");
// const TextCommand = require("../structures/TextCommand.js");
const { distance } = require("fastest-levenshtein");

const quotes = ['"', "'", '“”', '‘’'];
const flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map((qu) => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join("|")}|([\\w<>@#&!-]+)))?`, "g");
const delim = new RegExp("(\\s)(?:\\s)+");

class MessageCreate extends Event {

  getFlags(content) {
    const flags = {};
    content = content.replace(flagRegex, (match, fl, ...quote) => {
      flags[fl] = (quote.slice(0, -2).find((el) => el) || fl).replace(/\\/g, "");
      return "";
    }).replace(delim, "$1");

    return { content, flags };
  }

  async run(message) {
    if (!message.content || message.author.bot) return;

    const { user } = this.client;

    let rawContent = message.content;
    let prefixLength = 0;
    const regex = new RegExp(`<@!?${user.id}>${!message.guild ? "|" : ""}`);
    const match = message.content.match(regex);

    if (match) {
      prefixLength = match[0].length;
      rawContent = message.content.slice(prefixLength).trim();
    }

    // A mention only.
    if (!rawContent) {
      return message.channel.send("👋 Hi there! Run `@Miyako help` to see all I can do or browse the slash commands by typing `/`");
    }

    const { content, flags } = this.getFlags(rawContent);

    const args = content.split(/ +/g);
    const alias = args.shift().toLowerCase();

    const command = this.client.commands.get(alias);
    if (!command) return this.closestCommand(message, alias);
    if (!command.modes.includes("text")) return;

    const ctx = new CommandContext(command, {
      message, flags, content,
      prefixLength, alias, args
    });

    if (command.ownerOnly && !ctx.owner) {
      return ctx.reply({
        content: "This command can only be used by the owner."
      });
    }

    return command.execute(ctx);
  }

  closestCommand(msg, cmd) {
    const { commands } = this.client;
    const arr = [...commands.keys(), ...commands.aliases.keys()];

    let minDistance = Infinity;
    let minIndex = 0;

    for (let i = 0; i < arr.length; i++) {
      const dist = distance(cmd, arr[i]);
      if (dist < minDistance) {
        minDistance = dist;
        minIndex = i;
      }
    }

    if (minDistance > 2) return;

    const match = arr[minIndex];
    return msg.channel.send(`|\`❔\`| Did you mean \`${match}\`?`);
  }
}

module.exports = MessageCreate;
