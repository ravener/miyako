const { Event } = require("klasa");

class GuildMemberRemove extends Event {
  
  async run(member) {

    await member.settings.destroy().catch(() => null);

    this.client.emit("modlogs", member.guild, "memberLeave", { member, name: "leave" });
    
    const guild = member.guild;
    if(!guild.settings.leave.enabled || !guild.settings.leave.message || !guild.settings.leave.channel) return;
    
    const channel = guild.channels.get(guild.settings.leave.channel);
    if(!channel || !channel.postable) return;
    
    const msg = guild.settings.leave.message
      .replace(/{guild}/ig, guild.name)
      .replace(/{server}/ig, guild.name)
      .replace(/{name}/ig, member.displayName)
      .replace(/{count}/ig, guild.memberCount);
      
    channel.send(msg).catch(() => null);
  }
}

module.exports = GuildMemberRemove;
