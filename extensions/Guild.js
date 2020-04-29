const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", (Guild) => class MiyakoGuild extends Guild {
  get settings() {
    return this.client.settings.get(this.id) || { id: this.id, weebGreetings: false, prefix: "m!", levelup: true, social: true };
  }

  syncSettings() {
    return this.client.settings.sync(this.id);
  }
});
