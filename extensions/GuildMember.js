const { Structures } = require("discord.js");

module.exports = Structures.extend("GuildMember", (GuildMember) => class MiyakoGuildMember extends GuildMember {

  async getBalance() {
    const id = `${this.guild.id}.${this.id}`;
    const { rows } = await this.client.db.query("SELECT points FROM members WHERE id = $1", [id]);
    if(!rows.length) return 0;
    return rows[0].points;
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
