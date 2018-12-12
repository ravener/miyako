const { Command } = require("klasa");
const { clean } = require("../../utils/utils.js");

class Nick extends Command {
  constructor(...args) {
    super(...args, {
      description: "Change someone's nick!",
      requiredPermissions: ["MANAGE_NICKNAMES"],
      permissionLevel: 5,
      usageDelim: " ",
      usage: "<you|me|member:membername> <nick:...string>",
      runIn: ["text"],
      aliases: ["nickname", "changenickname", "changenick", "setnick", "setnickname"]
    });
  }

  async run(msg, [member, nick]) {
    // If i remember correctly that is the limit.
    if(nick.length >= 32) throw "Nickname must be less than 32 characters.";
    if(member === "you") member = msg.guild.me;
    if(member === "me") member = msg.member;
    const botRole = msg.guild.me.roles.highest;
    const role = member.roles.highest;
    if(role.position >= botRole.position) throw "I can't edit nicknames of people with higher role than mine.";
    await member.edit({ nick });
    return msg.send(`Set ${member === msg.guild.me ? "my" : member === msg.member ? "your" : member.user.username}'s nickname to **${clean(nick)}**`);
  }
}

module.exports = Nick;
