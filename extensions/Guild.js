const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", (Guild) => class MiyakoGuild extends Guild {
  get settings() {
    return this.client.settings.guilds.get(this.id) || {
      id: this.id,
      weebGreetings: false,
      prefix: "m!",
      levelup: true,
      social: true
    };
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
