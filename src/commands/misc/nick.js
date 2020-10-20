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

  async run(msg, [member, ...nick]) {
    if(member === "me") member = msg.member;
    else if(member === "you") member = msg.guild.me;
    else member = await this.verifyMember(msg, member);

    if(!nick.length) return msg.send("Baka! You didn't tell me what nickname to use.");
    nick = nick.join(" ");

    if(nick.length >= 32) return msg.send("Nickname must be less than 32 characters.");
    if(member.roles.highest.position > msg.guild.me.roles.highest.position)
      return msg.send("I can't edit nicknames of people with higher role than mine.");

    await member.edit({ nick });
    return msg.send(`Set ${member === msg.guild.me ? "my" : member === msg.member ? "your" : member.user.username}'s nickname to **${nick}**`);
  }
}

module.exports = Nick;
