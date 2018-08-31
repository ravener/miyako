const { Command } = require("klasa");

class Kick extends Command {
  constructor(...args) {
    super(...args, {
      description: "Kicks a user.",
      permissionLevel: 5,
      runIn: ["text"],
      usage: "<member:member> [reason:string] [...]",
      usageDelim: " ",
      requiredPermissions: ["KICK_MEMBERS"]
    });
  }
  
  async run(msg, [member, ...reason]) {
    if (member.id === msg.author.id) throw "Why would you kick yourself?";
    if (member.id === this.client.user.id) throw "Have I done something wrong?";
    if(member.id === msg.guild.owner.id) throw "You can't kick the owner.";
    
    if (member.roles.highest.position >= msg.member.roles.highest.position) throw "You cannot kick this user.";
    if (!member.kickable) throw "I cannot kick this user.";
    
    const options = {};
    reason = reason.length ? reason.join(" ") : null;
    if (reason) options.reason = reason;
    
    await member.kick(options);
    this.client.emit("modlogs", msg.guild, "kick", { member, name: "kick", reason, kicker: msg.author });
    return msg.sendMessage(`${member.user.tag} got kicked.${reason ? ` With reason of: ${reason}` : ""}`);
  }
}

module.exports = Kick;