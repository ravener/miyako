const Command = require("../../structures/Command.js");

class WeebGreetings extends Command {
  constructor(...args) {
    super(...args, {
      description: "Enable/Disable Weeb style welcome/leave messages.",
      usage: "weebgreetings <enable|disable> <channel>",
      userPermissions: ["MANAGE_GUILD"],
      guildOnly: true
    });
  }

  async run(ctx, [action]) {
    if(!action) return ctx.reply("Baka! Specify either `enable #channel` or `disable`");

    if(action === "disable") {
      await ctx.guild.update({ weebGreetings: null });
      return ctx.reply("Successfully disabled weeb greetings.");
    }

    if(action === "enable") {
      if(!ctx.message.mentions.channels.size) return ctx.reply("Baka! Specify the channel you want to enable it on.");
      const channel = ctx.message.mentions.channels.first();
      await ctx.guild.update({ weebGreetings: channel.id });
      return ctx.reply(`Successfully enabled weeb greetings for the channel ${channel}`);
    }

    return ctx.reply("Baka! Invalid action either specify `enable #channel` or `disable`");
  }
}

module.exports = WeebGreetings;
