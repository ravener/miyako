const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Announcements extends Command {
  constructor(...args) {
    super(...args, {
      name: "announcements",
      description: "Get bot related announcements.",
      usage: "announcements",
      aliases: ["announce", "news"]
    });
  }

  async run(ctx) {
    const guild = this.client.guilds.cache.get(this.client.constants.mainGuildID);
    const channel = guild.channels.cache.get("460796274686558209");
    const messages = await channel.messages.fetch({ limit: 1 });
    const announcement = messages.first();
    
    const embed = new MessageEmbed()
      .setTitle("Bot announcement!")
      .setAuthor(announcement.author.username, announcement.author.displayAvatarURL({ size: 64 }))
      .setDescription(announcement.cleanContent)
      .setThumbnail(announcement.author.displayAvatarURL({ size: 512 }))
      .setTimestamp(new Date(announcement.createdTimestamp))
      .setColor(0x9590EE);
    return ctx.reply({ embed });
  }
}

module.exports = Announcements;
