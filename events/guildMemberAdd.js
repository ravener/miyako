const Event = require("../structures/Event.js");

class GuildMemberAdd extends Event {
  async run(member) {
    if(!member.guild.available) return;
    if(!member.guild.settings || !member.guild.settings.weebGreetings) return;
    
    const channel = member.guild.channels.cache.get(member.guild.settings.weebGreetings);
    if(!channel) return;

    return channel.send(this.client.utils.random(this.client.responses.welcomeMessages)
      .replace(/{{user}}/g, member.user.username)
      .replace(/{{amount}}/g, member.guild.memberCount)
      .replace(/{{guild}}/g, member.guild.name)).catch(() => null);
  }
}

module.exports = GuildMemberAdd;
