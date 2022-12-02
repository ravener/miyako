const Event = require("../structures/Event.js");
const CommandContext = require("../structures/CommandContext.js");
const { distance } = require("fastest-levenshtein");
const { plural, missingPermissions } = require("../utils/utils.js");

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
    if (message.channel.partial) await message.channel.fetch();

    const { user } = this.client;

    const regex = new RegExp(`<@!?${user.id}>${!message.guild ? "|" : ""}`);
    const match = message.content.match(regex);

    if (!match) return;

    const prefixLength = match[0].length;
    const rawContent = message.content.slice(prefixLength).trim();

    // A mention only.
    if (!rawContent) {
      return message.channel.send("👋 Hi there! Run `@Miyako help` to see all I can do or browse the slash commands by typing `/`");
    }

    const { content, flags } = this.getFlags(rawContent);

    const args = content.split(/ +/g);
    const alias = args.shift().toLowerCase();

    const command = this.client.commands.get(alias);
    const ctx = new CommandContext(command, {
      message, flags, content,
      prefixLength, alias, args
    });

    if (!command) return this.closestCommand(ctx, alias);
    if (!command.modes.includes("text")) return;

    if (command.ownerOnly && !ctx.owner) {
      return ctx.reply({
        content: "This command can only be used by the owner."
      });
    }

    if (command.guildOnly && !ctx.guild) {
      return ctx.reply({
        content: "Ba-baka! What do you think you're doing in my DMs? That command can only be used in a server!"
      });
    }

    if (!(await this.checkPermissions(ctx, command))) return;

    return command.execute(ctx);
  }

  async checkPermissions(ctx, command) {
    // No Permissions for DMs
    if (!ctx.guild) return true;

    const permissions = ctx.channel.permissionsFor(this.client.user);
    const missing = missingPermissions(permissions, command.botPermissions);

    if (missing.length) {
      await ctx.reply({
        content: `I need the following permission${plural(missing)} to run that command: **${missing.join(", ")}**`
      });

      return false;
    }

    // Owner bypasses permission restrictions.
    if (ctx.owner) return true;

    const userPermissions = ctx.channel.permissionsFor(ctx.author);
    const user = missingPermissions(userPermissions, command.userPermissions);

    if (user.length) {
      await ctx.reply({
        content: `You need the following permission${plural(user)} to run that command: **${user.join(", ")}**`
      });

      return false;
    }

    return true;
  }

  closestCommand(ctx, cmd) {
    const commands = this.client.commands.usableCommands(ctx.message);
    const aliases = commands.map(command => command.aliases).flat();
    const arr = [...commands.map(command => command.name), ...aliases];

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
    return ctx.reply(`|\`❔\`| Did you mean \`${match}\`?`);
  }
}

module.exports = MessageCreate;
