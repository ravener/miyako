const { Event } = require("klasa");

class GuildBanAdd extends Event {
  
  run(guild, user) {
    if(!guild.available) return;
    this.client.emit("modlogs", guild, "ban", { user, name: "ban" });
  }
}

module.exports = GuildBanAdd;