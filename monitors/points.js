
// This code makes me feel sick, I hate my database management, I should implement some sort of cache and abstraction.
class Points {
  constructor(client) {
    this.client = client;
    this.timeouts = new Set();
  }

  async run(msg) {
    if(!msg.guild) return;
    if(this.timeouts.has(msg.author.id)) return;
    if(!msg.member) await msg.guild.members.fetch(msg.author);
    const { rows } = await this.client.db.query("SELECT prefix, levelup, social FROM guilds WHERE id = $1", [msg.guild.id]);

    const social = rows.length ? rows[0].social : true;
    const prefix = rows.length ? rows[0].prefix : "m!";
    const levelup = rows.length ? rows[0].levelup : true;

    if(!social) return;
    if(msg.content.startsWith(prefix)) return;

    // Random point between 1-5
    const points = Math.floor(Math.random() * 5) + 1;
    await msg.member.givePoints(points);

    const { userRows } = await this.client.db.query(`SELECT * FROM members WHERE id = $1`, [`${msg.guild.id}.${msg.author.id}`]);

    const balance = userRows.length ? userRows[0].points : 0;
    const level = userRows.length ? userRows[0].level : 0;

    const curLevel = Math.floor(0.1 * Math.sqrt(balance));

    if(level < curLevel) {
      if(levelup) {
        await msg.channel.send(this.client.utils.random(this.client.responses.levelUpMessages)
          .replace(/{{user}}/g, msg.member.displayName)
          .replace(/{{level}}/g, curLevel));
      }
      await msg.member.setLevel(curLevel);
    }

    this.timeouts.add(msg.author.id);
    setTimeout(() => this.timeouts.delete(msg.author.id), 5000);
  }
}

module.exports = Points;
