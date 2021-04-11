const Event = require("../structures/Event.js");

class GuildMemberRemove extends Event {
  async run(member) {
    if (!member.guild.available) return;

    await this.client.settings.members.delete(`${member.guild.id}.${member.id}`).catch(() => null);

    if (!member.guild.settings || !member.guild.settings.weebGreetings) return;

    const channel = member.guild.channels.cache.get(member.guild.settings.weebGreetings);
    if (!channel) return;

    return channel.send(this.client.utils.random(member.guild.language.get("GOODBYE_MESSAGES"))
      .replace(/{{user}}/g, member.user.username)
      .replace(/{{amount}}/g, member.guild.memberCount)
      .replace(/{{guild}}/g, member.guild.name))
      .catch(() => null);
  }
}

module.exports = GuildMemberRemove;
