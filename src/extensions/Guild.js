const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", (Guild) => class MiyakoGuild extends Guild {
  get settings() {
    return this.client.settings.guilds.getDefaults(this.id);
  }

  get prefix() {
    return this.settings.prefix;
  }

  get social() {
    return this.settings.social;
  }

  syncSettings() {
    return this.client.settings.guilds.sync(this.id);
  }

  /**
   * Alias
   * this.client.settings.guilds.update(guild.id, { prefix: "..." }) 
   * to just
   * guild.update({ prefix: "..." })
   */
  update(obj) {
    return this.client.settings.guilds.update(this.id, obj);
  }
});
