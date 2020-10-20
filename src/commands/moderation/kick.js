const Command = require("../../structures/Command.js");

class Kick extends Command {
  constructor(...args) {
    super(...args, {
      description: "Kicks a user.",
      userPermissions: ["KICK_MEMBERS"],
      botPermissions: ["KICK_MEMBERS"],
      guildOnly: true,
      usage: "kick <@member> [reason]"
    });
  }
  
  async run(msg, [member, ...reason]) {
    member = await this.verifyMember(msg, member);

    if(member.id === msg.author.id) return msg.send("Baka! Why would you kick yourself?");
    if(member.id === this.client.user.id) return msg.send("Baka! Why would you kick me?");
    if(member.id === msg.guild.ownerID) return msg.send("Baka! You can't kick the owner.");
    
    if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.send("You cannot kick this user.");
    if(!member.kickable) return msg.send("I cannot kick this user.");
    
    const options = {};
    reason = reason.length ? reason.join(" ") : null;
    if(reason) options.reason = reason;
    
    await member.kick(options);
    return msg.send(`${member.user.tag} got kicked.${reason ? ` With reason of: ${reason}` : ""}`);
  }
}

module.exports = Kick;
