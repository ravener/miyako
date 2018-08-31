const { Command } = require("klasa");

class Ban extends Command {
  constructor(...args) {
    super(...args, {
      description: "Bans a user.",
      permissionLevel: 5,
      runIn: ["text"],
      usage: "<member:member> [reason:string] [...]",
      usageDelim: " ",
      requiredPermissions: ["BAN_MEMBERS"]
    });
  }
  
  async run(msg, [member, ...reason]) {
    if (member.id === msg.author.id) throw "Why would you ban yourself?";
    if (member.id === this.client.user.id) throw "Have I done something wrong?";
    if(member.id === msg.guild.owner.id) throw "You can't ban the owner.";
    
    if (member.roles.highest.position >= msg.member.roles.highest.position) throw "You cannot ban this user.";
    if (!member.bannable) throw "I cannot ban this user.";
    
    const options = { days: 7 };
    reason = reason.length ? reason.join(" ") : null;
    if (reason) options.reason = reason;
    
    await member.ban(options);
    return msg.sendMessage(`${member.user.tag} got banned.${reason ? ` With reason of: ${reason}` : ""}`);
  }
}

module.exports = Ban;