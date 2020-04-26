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
      await this.client.db.query("UPDATE guilds SET \"weebGreetings\" = false WHERE id = $1", [ctx.guild.id])
      return ctx.reply("Successfully disabled weeb greetings.");
    }

    if(action === "enable") {
      if(!ctx.message.mentions.channels.size) return ctx.reply("Baka! Specify the channel you want to enable it on.");
      const channel = ctx.message.mentions.channels.first();
      await this.client.db.query("INSERT INTO guilds (id, \"weebGreetings\") VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET \"weebGreetings\" = $2", [ctx.guild.id, channel.id]);
      return ctx.reply(`Successfully enabled weeb greetings for the channel ${channel}`);
    }

    return ctx.reply("Baka! Invalid action either specify `enable #channel` or `disable`");
  }
}

module.exports = WeebGreetings;
