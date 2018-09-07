const { Command } = require("klasa");

class Unban extends Command {
  constructor(...args) {
    super(...args, {
      description: "Unbans a member",
      requiredPermissions: ["BAN_MEMBERS"],
      permissionLevel: 6,
      usage: "<username:username|id:string>",
      runIn: ["text"]
    });
  }

  async run(msg, [user]) {
    if(user.id) user = user.id;
    const bans = await msg.guild.fetchBans();
    const ban = bans.get(user);
    if(!ban) throw "Member not found in bans list or ID is invalid.";
    await msg.guild.members.unban(ban.user.id);
    return msg.send(`Unbanned **${ban.user.tag}**`);
  }
}

module.exports = Unban;
