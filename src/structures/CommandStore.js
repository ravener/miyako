const Store = require("./Store.js");
const { OWNER_ID } = require("../utils/constants.js");

class CommandStore extends Store {
  constructor(client) {
    super(client, "commands");

    this.aliases = new Map();
    this.ran = 0;
  }

  get(name) {
    return super.get(name) || this.aliases.get(name);
  }

  has(name) {
    return super.has(name) || this.aliases.has(name);
  }

  set(command) {
    super.set(command);

    for (const alias of command.aliases) {
      this.aliases.set(alias, command);
    }

    return command;
  }

  delete(name) {
    const command = this.get(name);
    if (!command) return false;

    for (const alias of command.aliases) {
      this.aliases.delete(alias);
    }

    return super.delete(name);
  }

  clear() {
    super.clear();
    this.aliases.clear();
  }

  /**
   * Return list of usable commands in context.
   */
  usableCommands(msg) {
    return [...this.values()].filter(command => {
      // Skip disabled commands.
      if (!command.enabled) return false;
      // Skip owner commands.
      if (command.ownerOnly && msg.author.id !== OWNER_ID) return false;
      // Skip guild only commands.
      if (!msg.guild && command.guildOnly) return false;
      // Skip commands that the user does not have permissions to run.
      if (msg.guild && !msg.channel.permissionsFor(msg.author).has(command.userPermissions)) return false;
      // Skip NSFW commands.
      if (command.nsfw && !msg.channel.nsfw) return false;
      return true;
    });
  }
}

module.exports = CommandStore;
