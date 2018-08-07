const { Event } = require("klasa");

class GuildBanRemove extends Event {
  
  run(guild, user) {
    if(!guild.available) return;
    this.client.emit("modlogs", guild, "unban", { user, name: "ban" });
  }
}

module.exports = GuildBanRemove;