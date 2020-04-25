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
  
  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member);

    if(member.id === ctx.author.id) return ctx.reply("Baka! Why would you kick yourself?");
    if(member.id === this.client.user.id) return ctx.reply("Baka! Why would you kick me?");
    if(member.id === ctx.guild.ownerID) return ctx.reply("Baka! You can't kick the owner.");
    
    if(member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply("You cannot kick this user.");
    if(!member.kickable) return ctx.reply("I cannot kick this user.");
    
    const options = {};
    reason = reason.length ? reason.join(" ") : null;
    if(reason) options.reason = reason;
    
    await member.kick(options);
    return ctx.reply(`${member.user.tag} got kicked.${reason ? ` With reason of: ${reason}` : ""}`);
  }
}

module.exports = Kick;
