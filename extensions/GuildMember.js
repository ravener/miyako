const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", (GuildMember) => class MiyakoGuildMember extends GuildMember {

  get settings() {
    const id = `${this.guild.id}.${this.id}`;
    return this.client.members.get(`${this.guild.id}.${this.id}`) || { id, level: 0, points: 0, daily: null };
  }

  syncSettings() {
    return this.client.members.sync(`${this.guild.id}.${this.id}`);
  }

  setLevel(level) {
    if(isNaN(level)) throw new Error("Level cannot be NaN");
    const id = `${this.guild.id}.${this.id}`;
    return this.client.members.update(id, { level });
  }

  async givePoints(amount) {
    const id = `${this.guild.id}.${this.id}`;
    const points = parseInt(this.settings.points) + parseInt(amount);
    if(isNaN(points)) throw new Error("Cannot give NaN points to member.");
    return this.client.members.update(id, { points });
  }

  takePoints(amount) {
    return this.givePoints(-amount);
  }
});
