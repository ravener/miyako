const { Event } = require("klasa");

class GuildMemberRemove extends Event {
  
  run(member) {
    
    this.client.emit("modlogs", member.guild, "memberLeave", { member, name: "leave" });
    
    const guild = member.guild;
    if(!guild.configs.leave.enabled || !guild.configs.leave.message || !guild.configs.leave.channel) return;
    
    const channel = guild.configs.welcome.channel;
    if(!channel || !channel.postable) return;
    
    const msg = guild.configs.welcome.message
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