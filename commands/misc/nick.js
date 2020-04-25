const Command = require("../../structures/Command.js");

class Nick extends Command {
  constructor(...args) {
    super(...args, {
      description: "Change someone's nick!",
      botPermissions: ["MANAGE_NICKNAMES"],
      userPermissions: ["MANAGE_NICKNAMES"],
      usage: "nick <you|me|@member> <nick>",
      guildOnly: true,
      aliases: ["nickname", "changenickname", "changenick", "setnick", "setnickname"]
    });
  }

  async run(ctx, [member, ...nick]) {
    if(member === "me") member = ctx.member;
    else if(member === "you") member = ctx.guild.me;
    else member = await this.verifyMember(ctx, member);

    if(!nick.length) return ctx.reply("Baka! You didn't tell me what nickname to use.");
    nick = nick.join(" ");

    if(nick.length >= 32) return ctx.reply("Nickname must be less than 32 characters.");
    if(member.roles.highest.position >= ctx.guild.me.roles.highest.position)
      return ctx.reply("I can't edit nicknames of people with higher role than mine.");

    await member.edit({ nick });
    return ctx.reply(`Set ${member === ctx.guild.me ? "my" : member === ctx.member ? "your" : member.user.username}'s nickname to **${nick}**`);
  }
}

module.exports = Nick;
