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

  async run(msg, [action]) {
    if(!action || !["enable", "disable"].includes(action)) return msg.send("Baka! Do you want me to disable or enable it?");

    if(action === "enable") {
      await msg.guild.update({ levelup: true });
      return msg.send("Successfully enabled level up messages.");
    }

    if(action === "disable") {
      await msg.guild.update({ levelup: false });
      return msg.send("Successfully disabled level up messages.");
    }
  }
}

module.exports = LevelUp;
