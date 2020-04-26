const Event = require("../structures/Event.js");

class GuildMemberAdd extends Event {
  async run(member) {
    if(!member.guild.available) return;
    
    const { rows } = await this.client.db.query("SELECT \"weebGreetings\" FROM guilds WHERE id = $1", [member.guild.id]);

    if(!rows.length) return;
    if(!rows[0].weebGreetings) return;

    const channel = member.guild.channels.cache.get(rows[0].weebGreetings);
    if(!channel) return;

    return channel.send(this.client.utils.random(this.client.responses.welcomeMessages)
      .replace(/{{user}}/g, member.user.username)
      .replace(/{{amount}}/g, member.guild.memberCount)
      .replace(/{{guild}}/g, member.guild.name)).catch(() => null);
  }
}

module.exports = GuildMemberAdd;
