const Event = require("../structures/Event.js");
const CommandContext = require("../structures/CommandContext.js");
const { Collection, Permissions } = require("discord.js");

// Taken from klasa https://github.com/dirigeants/klasa
const quotes = ['"', "'", '“”', '‘’'];
const flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map((qu) => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join("|")}|([\\w<>@#&!-]+)))?`, "g");
const delim = new RegExp("(\\s)(?:\\s)+");


class MessageEvent extends Event {
  constructor(...args) {
    super(...args);
    this.prefix = "m!"; // Default prefix.
    this.ratelimits = new Collection();
    this.friendlyPerms = Object.keys(Permissions.FLAGS).reduce((obj, key) => {
      obj[key] = this.client.utils.toProperCase(key.split("_").join(" "));
      return obj;
    }, {});
  }

  getFlags(content) {
    const flags = {};
    content = content.replace(flagRegex, (match, fl, ...quote) => {
      flags[fl] = (quote.slice(0, -2).find((el) => el) || fl).replace(/\\/g, "");
      return "";
    }).replace(delim, "$1");

    return { content, flags };
  }

  async checkPerms(msg, cmd) {
    if(msg.channel.type !== "text") return true; // No permissions in DMs.

    // Check if user has permissions to run the command. Owner gets a bypass.
    const user = msg.author.id === this.client.constants.ownerID ? [] : msg.member.permissions.missing(cmd.userPermissions);
    if(user.length > 0) {
      await msg.channel.send(`You do not have the following permission${user.length === 1 ? "" : "s"} to run this command: \`${user.map((p) => this.friendlyPerms[p]).join(", ")}\``);
      return false;
    }

    // Now check if the bot has the permissions to perform the intended action.
    const bot = msg.channel.permissionsFor(this.client.user).missing(cmd.botPermissions);
    if(bot.length > 0) {
      await msg.channel.send(`Hey! I need the following permission${bot.length === 1 ? "" : "s"} to do that: \`${bot.map((p) => this.friendlyPerms[p]).join(", ")}\``);
      return false;
    }
    
    return true;
  }

  async run(msg) {
    if(msg.webhookID || msg.author.bot) return; // Ignore bots and webhooks.
    if(msg.guild && !msg.guild.me) await msg.guild.members.fetch(this.client.user);
    if(msg.content === this.client.user.toString() || (msg.guild && msg.content === msg.guild.me.toString()))
      return msg.channel.send("Hi! Run `m!help` to get a list of commands you can use.");

    this.client.points.run(msg).catch(() => null);

    let prefix;
    if(msg.channel.type === "dm") {
      prefix = this.prefix;
    } else {
      prefix = await this.client.db.query("SELECT * FROM guilds WHERE id = $1", [msg.guild.id]).then(({ rows }) => {
        if(!rows.length) return this.prefix;
        return rows[0].prefix;
      });
    }

    const prefixMatch = new RegExp(`^<@!?${this.client.user.id}> |^${this.client.utils.escapeRegex(prefix)}`).exec(msg.content);
    if (!prefixMatch) return;

    const { content, flags } = this.getFlags(msg.content);

    const args = content.slice(prefixMatch[0].length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = this.client.commands.get(cmd);

    if(!command) return this.client.emit("commandUnknown", msg, cmd);

    const rl = this.ratelimit(msg, command);
    if(typeof rl === "string")
      return msg.channel.send(rl);

    if(command.ownerOnly && msg.author.id !== this.client.constants.ownerID)
      return msg.channel.send("Baka! What do you think you're doing? That command is only for my master!");

    if(command.guildOnly && !msg.guild)
      return msg.channel.send("Baka! This command can only be used in a guild. What are you doing sliding in my DMs?");

    if(!command.enabled && msg.author.id !== this.client.constants.ownerID)
      return msg.channel.send("My master has ordered me to disable that command so I cannot let you use it!");

    if(command.guildOnly && !msg.member) await msg.guild.members.fetch(msg.author);

    if(!(await this.checkPerms(msg, command))) return;

    const ctx = new CommandContext(this.client, msg);

    // Initialize context
    ctx.args = args;
    ctx.flags = flags;
    ctx.parsedContent = content;
    ctx.command = command;
    ctx.invokedName = cmd;
    ctx.prefix = prefixMatch[0];
    ctx.guildPrefix = prefix;
    
    this.client.commands.ran++;
    msg.channel.startTyping();
    return command._run(ctx, args)
      .then(() => msg.channel.stopTyping());
  }

  ratelimit(msg, cmd) {
    if(msg.author.id === this.client.constants.ownerID) return false;
    if(cmd.cooldown === 0) return false;

    const cooldown = cmd.cooldown * 1000;
    const ratelimits = this.ratelimits.get(msg.author.id) || {};
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown;
    const difference = Date.now() - ratelimits[cmd.name];
    if (difference < cooldown) { // check the if the duration the command was run, is more than the cooldown
      return `Woah! Why the hurry? You can run this command again in **${Math.round((cooldown - difference) / 1000)}** seconds.`;
    } else {
      ratelimits[cmd.name] = Date.now(); // set the key to now, to mark the start of the cooldown
      this.ratelimits.set(msg.author.id, ratelimits); // set it
      return true;
    }
  }
}

module.exports = MessageEvent;
