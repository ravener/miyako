const Command = require("../../structures/Command.js");

class HackBan extends Command {
  constructor(...args) {
    super(...args, {
      description: "Bans a user that isn't in the server.",
      extendedHelp: "This command will ban a user that is not in the server to prevent them from joining in the future.",
      userPermissions: ["BAN_MEMBERS"],
      aliases: ["hban"],
      botPermissions: ["BAN_MEMBERS"],
      usage: "<userID> [reason...]",
      guildOnly: true
    });
  }
  
  async run(msg, [id, ...reason]) {
    if(!id) return msg.send(`Usage: \`${msg.guild.prefix}${this.usage}\``);

    if(isNaN(parseInt(id))) return msg.send("Invalid user id.");

    reason = reason.join(" ") || undefined;

    try {
      const user = await msg.guild.members.ban(id, { reason });
      return msg.send(`Banned **${user.tag}** (${user.id})`);
    } catch(err) {
      return msg.send("Couldn't ban that user, make sure the ID is valid.");
    }
  }
}

module.exports = HackBan;
