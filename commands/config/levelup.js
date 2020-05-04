const Command = require("../../structures/Command.js");

class LevelUp extends Command {
  constructor(...args) {
    super(...args, {
      description: "Enable/Disable Level up messages.",
      aliases: ["levelupmessages", "levelmessage", "lvlmsg", "lvlupmessages"],
      userPermissions: ["MANAGE_GUILD"],
      usage: "levelup <enable/disable>",
      guildOnly: true
    });
  }

  async run(ctx, [action]) {
    if(!action || !["enable", "disable"].includes(action)) return ctx.reply("Baka! Do you want me to disable or enable it?");

    if(action === "enable") {
      await ctx.guild.update({ levelup: true });
      return ctx.reply("Successfully enabled level up messages.");
    }

    if(action === "disable") {
      await ctx.guild.update({ levelup: false });
      return ctx.reply("Successfully disabled level up messages.");
    }
  }
}

module.exports = LevelUp;
