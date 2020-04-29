const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", (GuildMember) => class MiyakoGuildMember extends GuildMember {

  get settings() {
    const id = `${this.guild.id}.${this.id}`
    return this.client.members.get(`${this.guild.id}.${this.id}`) || { id, level: 0, points: 0, daily: 0 };
  }

  syncSettings() {
    return this.client.members.sync(`${this.guild.id}.${this.id}`);
  }

  async getBalance() {
    const id = `${this.guild.id}.${this.id}`;
    const { rows } = await this.client.db.query("SELECT points FROM members WHERE id = $1", [id]);
    if(!rows.length) return 0;
    return parseInt(rows[0].points);
  }

  setLevel(level) {
    if(isNaN(level)) throw new Error("Level cannot be NaN");
    const id = `${this.guild.id}.${this.id}`;
    return this.client.db.query("UPDATE members SET level = $1 WHERE id = $2", [level, id]);
  }

  async givePoints(points) {
    const id = `${this.guild.id}.${this.id}`;
    const balance = await this.getBalance();
    const amount = balance + parseInt(points);
    if(isNaN(amount)) throw new Error("Cannot give NaN points to member.");

    return this.client.db.query("INSERT INTO members (id, points) VALUES ($1, $2) ON CONFLICT(id) DO UPDATE SET points = $2",
      [id, amount]);
  }
});
