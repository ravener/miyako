const { Event } = require("klasa");

class GuildBanAdd extends Event {
  
  async run(guild, user) {
    if(!guild.available) return;
    const reason = await guild.fetchBans().then((bans) => bans.find((x) => x.user.id === user.id)).then((x) => x ? x.reason : null).catch(() => "Missing Permissions to fetch bans");
    this.client.emit("modlogs", guild, "ban", { user, name: "ban", reason });
  }
}

module.exports = GuildBanAdd;
