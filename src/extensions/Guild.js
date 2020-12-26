const { Structures } = require("discord.js");
const languages = require("../languages");

module.exports = Structures.extend("Guild", (Guild) => class MiyakoGuild extends Guild {
  get settings() {
    return this.client.settings.guilds.getDefaults(this.id);
  }

  get prefix() {
    return this.settings.prefix;
  }

  get blacklisted() {
    return this.client.user.settings.guildBlacklist.includes(this.id);
  }

  get social() {
    return this.settings.social;
  }

  get language() {
    return languages[this.settings.language || "english"] || languages.english; 
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
