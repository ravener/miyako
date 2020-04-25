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
  
  async run(ctx, [member, ...reason]) {
    member = await this.verifyMember(ctx, member);

    if(member.id === ctx.author.id) return ctx.reply("Baka! Why would you ban yourself?");
    if(member.id === this.client.user.id) return ctx.reply("Baka! Why would you ban me?");
    if(member.id === ctx.guild.ownerID) return ctx.reply("Baka! You can't ban the owner.");
    
    if(member.roles.highest.position >= ctx.member.roles.highest.position) return ctx.reply("You cannot ban this user.");
    if(!member.bannable) return ctx.reply("I cannot ban this user.");
    
    const options = { days: 7 };
    reason = reason.length ? reason.join(" ") : null;
    if(reason) options.reason = reason;
    
    await member.ban(options);
    return ctx.reply(`${member.user.tag} got banned.${reason ? ` With reason of: ${reason}` : ""}`);
  }
}

module.exports = Ban;
