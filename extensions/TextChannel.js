const { Structures } = require("discord.js");

module.exports = Structures.extend("TextChannel", (TextChannel) => class MiyakoTextChannel extends TextChannel {

  get readable() {
    return this.permissionsFor(this.guild.me).has("VIEW_CHANNEL");
  }

  get postable() {
    return (this.readable && this.permissionsFor(this.guild.me).has("SEND_MESSAGES"));
  }
});
