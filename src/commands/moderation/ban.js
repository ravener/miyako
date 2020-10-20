const Command = require("../../structures/Command.js");

class Ban extends Command {
  constructor(...args) {
    super(...args, {
      description: "Bans a user.",
      userPermissions: ["BAN_MEMBERS"],
      botPermissions: ["BAN_MEMBERS"],
      guildOnly: true,
      usage: "ban <@member> [reason]"
    });
  }
  
  async run(msg, [member, ...reason]) {
    member = await this.verifyMember(msg, member);

    if(member.id === msg.author.id) return msg.send("Baka! Why would you ban yourself?");
    if(member.id === this.client.user.id) return msg.send("Baka! Why would you ban me?");
    if(member.id === msg.guild.ownerID) return msg.send("Baka! You can't ban the owner.");
    
    if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.send("You cannot ban this user.");
    if(!member.bannable) return msg.send("I cannot ban this user.");
    
    const options = { days: 7 };
    reason = reason.length ? reason.join(" ") : null;
    if(reason) options.reason = reason;
    
    await member.ban(options);
    return msg.send(`${member.user.tag} got banned.${reason ? ` With reason of: ${reason}` : ""}`);
  }
}

module.exports = Ban;
