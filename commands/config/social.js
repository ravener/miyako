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

  async run(ctx, [action]) {
    if(!action || !["enable", "disable"].includes(action)) return ctx.reply("Baka! Do you want me to disable or enable it?");

    if(action === "enable") {
      await this.client.settings.update(ctx.guild.id, { social: true });
      return ctx.reply("Successfully enabled the social economy system.");
    }

    if(action === "disable") {
      await this.client.settings.update(ctx.guild.id, { social: false });
      return ctx.reply("Successfully disabled the social economy system.");
    }
  }
}

module.exports = Social;
