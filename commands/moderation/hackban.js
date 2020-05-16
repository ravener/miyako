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
  
  async run(ctx, [id, ...reason]) {
    if(!id) return ctx.reply(`Usage: \`${ctx.guild.prefix}${this.usage}\``);

    if(isNaN(parseInt(id))) return ctx.reply("Invalid user id.");

    reason = reason.join(" ") || undefined;

    try {
      const user = await ctx.guild.members.ban(id, { reason });
      return ctx.reply(`Banned **${user.tag}** (${user.id})`);
    } catch(err) {
      return ctx.reply("Couldn't ban that user, make sure the ID is valid.");
    }
  }
}

module.exports = HackBan;
