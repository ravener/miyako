const { Permissions } = require("discord.js");
const Base = require("./Base.js");
const path = require("path");

class Command extends Base {
  constructor(client, store, file, options = {}) {
    super(client, store, file, options);

    this.description = options.description || "No Description Provided.";
    this.extendedHelp = options.extendedHelp || "No extended help provided.";
    this.ownerOnly = options.ownerOnly || false;
    this.aliases = options.aliases || [];
    this.cooldown = options.cooldown || 0;
    this.cost = options.cost || 0;
    this.nsfw = options.nsfw || false;
    // File path is like general/ping.js we split by / and take general title-cased if not provided.
    this.category = options.category || this.client.utils.toProperCase(file.path.split(path.sep)[0]) || "General";
    this.guildOnly = options.guildOnly || false;
    this.hidden = options.hidden || false;
    this.usage = options.usage || this.name;
    this.loading = options.loading;

    this.botPermissions = new Permissions(options.botPermissions || []).freeze();
    this.userPermissions = new Permissions(options.userPermissions || []).freeze();

    // Helper alias.
    this.responses = this.client.responses;
  }

  async _run(msg, args) {
    try {
      if (this.loading && msg.guild) {
        await msg.send(this.loading
          .replace(/{{displayName}}/g, msg.member.displayName)
          .replace(/{{username}}/g, msg.author.username)
          .replace(/{{tag}}/g, msg.author.tag)
          .replace(/{{mention}}/g, msg.member.toString())
          .replace(/{{guild}}/g, msg.guild.name)
          .replace(/{{typing}}/g, this.client.constants.typing))
          .catch(() => null);
      }

      // Run the check function first.
      const check = await this.check(msg, args);

      // If the value is falsy, silently fail.
      if (!check) return;

      // If the value is a string reply it to the user.
      if (typeof check === "string") return msg.send(check);

      // Run the command.
      const results = await this.run(msg, args);
 
      // If the results is a string reply it to the user.
      if (typeof results === "string") return msg.send(results);
    } catch(err) {
      // Forward errors to commandError event.
      this.client.emit("commandError", msg, err);
    }
  }

  /**
   * Verifies that a user is given.
   */
  async verifyUser(msg, user, defaultToAuthor = false) {
    if (!user && defaultToAuthor) return msg.author;
    if (!user) throw "What do you expect me to do without a user mention or an ID?";
    const match = /^(?:<@!?)?(\d{17,19})>?$/.exec(user);
    if (!match) throw "Baka! That's not a user mention or an ID. What were you trying to do?";
    user = await this.client.users.fetch(match[1]).catch(() => null);
    // We will assume they gave IDs as mentions are highly unlikely to fail.
    if (!user) throw "I couldn't find that user! Make sure the ID is correct.";
    return user;
  }

  /**
   * Verifies that a member is given.
   */
  async verifyMember(msg, member, defaultToAuthor = false) {
    const user = await this.verifyUser(msg, member, defaultToAuthor);
    const guildMember = await msg.guild.members.fetch(user).catch(() => null);
    if (!guildMember) throw "Baka! That user is not in this server.";
    return guildMember;
  }

  async verifyChannel(msg, channel, defaultToCurrent = false) {
    if (!channel && defaultToCurrent) return msg.channel;
    if (!channel) throw "You need to mention a channel or provide an ID.";

    const match = /^(?:<#)?(\d{17,19})>?$/.exec(channel);
    if (!match) throw "Invalid channel, must be a mention or an ID.";

    const chan = await this.client.channels.fetch(match[1]).catch(() => null);
    if (!chan) throw msg.language.get("CHANNEL_NOT_FOUND");

    return chan;
  }

  verifyRole(msg, rolename, optional = false) {
    if (!rolename && optional) return null;
    if (!rolename) throw "Baka! You must provide a role name or ID.";
    rolename = rolename.toLowerCase();

    // We check by ID or name. Nobody mentions roles for an argument.
    const role = msg.guild.roles.cache.find(role => (role.id === rolename) ||
      (role.name.toLowerCase() === rolename));

    if (!role) throw msg.language.get("ROLE_NOT_FOUND");

    return role;
  }

  verifyInt(num, def) {
    if (typeof def === "number" && !num) return def;
    const parsed = parseInt(num && num.replace(/,/g, ""));
    if (isNaN(parsed)) throw "Baka! You must provide a valid number.";
    return parsed;
  }

  /**
   * Executed before the command is ran.
   * A boolean is to be returned to either allow command execution or not.
   * A string can be returned to block execution with an error message.
   * @abstract
   * @returns {Boolean|String}
   */
  async check() {
    return true;
  }

  /**
   * The actual command implementation, must be implemented in a subclass.
   * @abstract
   */
  async run(msg) {
    return msg.send(`${this.constructor.name} does not provide a \`run()\` implementation.${msg.author.id !== this.client.constants.ownerID ? " This is a bug, please report this in our server at https://discord.gg/mDkMbEh" : ""}`);
  }
}

module.exports = Command;
