const Command = require("../../structures/Command.js");

class Social extends Command {
  constructor(...args) {
    super(...args, {
      description: "Enable/Disable The social economy system.",
      aliases: ["economy"],
      userPermissions: ["MANAGE_GUILD"],
      usage: "social <enable/disable>",
      guildOnly: true
    });
  }

  async run(msg, [action]) {
    if(!action || !["enable", "disable"].includes(action)) return msg.send("Baka! Do you want me to disable or enable it?");

    if(action === "enable") {
      await msg.guild.update({ social: true });
      return msg.send("Successfully enabled the social economy system.");
    }

    if(action === "disable") {
      await msg.guild.update({ social: false });
      return msg.send("Successfully disabled the social economy system.");
    }
  }
}

module.exports = Social;
