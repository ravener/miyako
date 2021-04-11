const Monitor = require("../structures/Monitor.js");
const { Collection, Permissions } = require("discord.js");

// Taken from klasa https://github.com/dirigeants/klasa
/* eslint-disable-next-line quotes */
const quotes = ['"', "'", '“”', '‘’'];
const flagRegex = new RegExp(`(?:--|—)(\\w[\\w-]+)(?:=(?:${quotes.map((qu) => `[${qu}]((?:[^${qu}\\\\]|\\\\.)*)[${qu}]`).join("|")}|([\\w<>@#&!-]+)))?`, "g");
const delim = new RegExp("(\\s)(?:\\s)+");

class CommandHandler extends Monitor {
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
    if (msg.channel.type !== "text") return true; // No permissions in DMs.

    // Check if user has permissions to run the command. Owner gets a bypass.
    const user = msg.author.id === this.client.constants.ownerID ? [] :
      msg.channel.permissionsFor(msg.author).missing(cmd.userPermissions);

    if (user.length > 0) {
      const perms = user.map(perm => this.friendlyPerms[perm]).join(", ");
      await msg.send(`You do not have the following permission${user.length === 1 ? "" : "s"} to run this command: \`${perms}\``);
      return false;
    }

    // Now check if the bot has the permissions to perform the intended action.
    const bot = msg.channel.permissionsFor(this.client.user).missing(cmd.botPermissions);
    if (bot.length > 0) {
      const perms = bot.map(perm => this.friendlyPerms[perm]).join(", ");
      await msg.send(`Hey! I need the following permission${bot.length === 1 ? "" : "s"} to do that: \`${perms}\``);
      return false;
    }
    
    return true;
  }

  async run(msg) {
    if (msg.webhookID || msg.author.bot) return; // Ignore bots and webhooks.

    // Ensure the bot itself is in the member cache.
    if (msg.guild && !msg.guild.me) await msg.guild.members.fetch(this.client.user);

    // Grab the current prefix.
    const prefix = msg.guild ? msg.guild.settings.prefix : this.prefix;

    // If we don't have permissions to send messages don't run the command.
    if (!msg.channel.postable) return;

    // Check for @mention only.
    if (msg.content === this.client.user.toString() || (msg.guild && msg.content === msg.guild.me.toString()))
      return msg.sendLocale("MENTION_REMINDER", [prefix]);

    // Users can have their own list of prefixes globally.
    // Might confuse other users but doesn't matter too much
    // it allows users to use their comfortable prefix everywhere.
    const userPrefix = (msg.author.settings.prefix && msg.author.settings.prefix.length) ?
      `|${msg.author.settings.prefix.map((p) => `^${this.client.utils.escapeRegex(p)}`).join("|")}` : "";

    // Possibilities:
    // - miyako ping
    // - yo miyako ping
    // - hey miyako ping
    // - @Miyako ping
    // - m!ping
    // - Or custom prefix.
    // - Or custom per-user prefix.
    //
    // A comma can be added after the (hey|yo|ok) and the (miyako) (e.g hey, miyako, ping)
    const prefixMatch = new RegExp(`^(?:(?:(?:hey|yo|ok),? )?miyako,? )|^<@!?${this.client.user.id}> |^${
      this.client.utils.escapeRegex(prefix)}${userPrefix}`, "i").exec(msg.content);

    // If the message is not a command do nothing.
    if (!prefixMatch) return;

    // Ignore blacklisted users/guilds. DM them a reminder if possible.
    if (msg.guild && msg.guild.blacklisted) return msg.author.send(msg.tr("BLACKLISTED_GUILD", msg.guild)).catch(() => null);
    if (msg.author.blacklisted) return msg.author.send(msg.tr("BLACKLISTED")).catch(() => null);

    // Parse flags.
    const { content, flags } = this.getFlags(msg.content);

    // Grab the command and the arguments.
    const args = content.slice(prefixMatch[0].length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = this.client.commands.get(cmd);

    // Handle unknown commands in a seperate event.
    if (!command) return this.client.emit("commandUnknown", msg, cmd);

    // Check cooldown.
    const rl = this.ratelimit(msg, command);
    if (typeof rl === "string") return msg.send(rl);

    // Command checks.

    if (command.ownerOnly && msg.author.id !== this.client.constants.ownerID) {
      return msg.sendLocale("OWNER_ONLY");
    }

    // Check for NSFW channel. NSFW is allowed in DMs
    if (command.nsfw && msg.guild && !msg.channel.nsfw) {
      return msg.send(this.client.utils.random(this.client.responses.notNSFWChannel));
    }

    if (command.guildOnly && !msg.guild) {
      return msg.sendLocale("GUILD_ONLY");
    }

    if (!command.enabled && msg.author.id !== this.client.constants.ownerID) {
      return msg.send("My master has ordered me to disable that command so I cannot let you use it!");
    }

    if (command.category === "Social" && !msg.guild.settings.social) {
      return msg.send("The social economy system has been disabled in this server by an Admin so I cannot let you use that command.");
    }

    // Verify the member is available and its settings are synchronized.
    if (msg.guild) {
      if (!msg.member) await msg.guild.members.fetch(msg.author);
      await msg.member.syncSettingsCache();
    }

    // Verify the user settings are synchronized.
    await msg.author.syncSettingsCache();

    // Check for permissions.
    if (!(await this.checkPerms(msg, command))) return;

    // If the command costs points and we are in a guild with the social system enabled.
    if (command.cost && msg.guild && msg.guild.settings.social) {

      const premium = await this.client.verifyPremium(msg.author);

      // Premium users get a 25% off the cost.
      const cost = command.cost - Math.floor(premium ? (command.cost / 2 / 2) : 0);

      // Grab the current balance.
      const balance = parseInt(msg.member.settings.points);

      // Give the user a tip if their daily is available.
      const claim = (msg.member.settings.daily === null || msg.member.settings.daily <  Date.now()) ?
        `\n\nSeems like you're broke. Why don't you start with claiming your daily credits with \`${prefix}daily\`?` : "";

      // Verify enough balance.
      if (balance < cost) {
        return msg.send(`You need **¥${cost}** to run that command but you only have **¥${balance}**.${claim}`);
      }

      // Deduct.
      await msg.member.takePoints(cost);
    }

    // Initialize message for command execution.
    msg.args = args;
    msg.commandFlags = flags;
    msg.parsedContent = content;
    msg.command = command;
    msg.alias = cmd;
    msg.prefix = prefixMatch[0];
    
    // Increment the counter.
    this.client.commands.ran++;

    // Start typing and run the command and then stop typing.
    msg.channel.startTyping();
    await command._run(msg, args);
    msg.channel.stopTyping();

    return this.stats(command);
  }

  ratelimit(msg, cmd) {
    // Owner is immune to cooldown.
    if (msg.author.id === this.client.constants.ownerID) return false;
    // Nothing to do here if the command doesn't have a cooldown.
    if (cmd.cooldown === 0) return false;

    // Convert cooldown seconds to milliseconds.
    const cooldown = cmd.cooldown * 1000;
    // Get the bucket for the user.
    const ratelimits = this.ratelimits.get(msg.author.id) || {};
    // Make sure the command is available in the bucket.
    if (!ratelimits[cmd.name]) ratelimits[cmd.name] = Date.now() - cooldown;
    // Calculate the difference.
    const difference = Date.now() - ratelimits[cmd.name];

    if (difference < cooldown) { // check the if the duration the command was run, is more than the cooldown
      // Return a human-readable string to the user with the remaining seconds.
      return `Woah! Why the hurry? You can run this command again in **${Math.round((cooldown - difference) / 1000)}** seconds.`;
    } else {
      ratelimits[cmd.name] = Date.now(); // set the key to now, to mark the start of the cooldown
      this.ratelimits.set(msg.author.id, ratelimits); // set it
      return true;
    }
  }

  // Tracks how many times a command is ran.
  stats(command) {
    const commands = this.client.user.settings.commands || {};
    if (!commands[command.name]) commands[command.name] = 0;
    
    commands[command.name]++;

    return this.client.user.update({ commands });
  }
}

module.exports = CommandHandler;
