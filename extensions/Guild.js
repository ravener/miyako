const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", (Guild) => class MiyakoGuild extends Guild {
  // In preparation of the new database abstraction. See db.md for more.
  get settings() {
    return this.client.settings.get(this.id);
  }
});
