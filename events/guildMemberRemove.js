const { Event } = require("klasa");

class GuildMemberRemove extends Event {
  
  run(member) {
    
    this.client.emit("modlogs", member.guild, "memberLeave", { member, name: "leave" });
    
    const guild = member.guild;
    if(!guild.settings.leave.enabled || !guild.settings.leave.message || !guild.settings.leave.channel) return;
    
    const channel = guild.channels.get(guild.settings.welcome.channel);
    if(!channel || !channel.postable) return;
    
    const msg = guild.settings.welcome.message
      .replace(/{guild}/ig, guild.name)
      .replace(/{server}/ig, guild.name)
      .replace(/{name}/ig, member.displayName)
      .replace(/{count}/ig, guild.memberCount);
      
    channel.send(msg).catch(() => null);
  }
  
  async init() {
    const { schema } = this.client.gateways.guilds;
    if(!schema.has("leave")) await schema.add("leave", {
      message: { type: "string" },
      channel: { type: "channel" },
      enabled: { type: "boolean" }
    });
  }
}

module.exports = GuildMemberRemove;