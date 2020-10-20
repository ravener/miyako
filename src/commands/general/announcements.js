const Command = require("../../structures/Command.js");


class Announcements extends Command {
  constructor(...args) {
    super(...args, {
      name: "announcements",
      description: "Get bot related announcements.",
      usage: "announcements",
      aliases: ["announce", "news"]
    });
  }

  async run(msg) {
    const guild = this.client.guilds.cache.get(this.client.constants.mainGuildID);
    const channel = guild.channels.cache.get("460796274686558209");
    const messages = await channel.messages.fetch({ limit: 1 });
    const announcement = messages.first();
    
    const embed = this.client.embed()
      .setTitle("Bot announcement!")
      .setAuthor(announcement.author.username, announcement.author.displayAvatarURL({ size: 64 }))
      .setDescription(announcement.cleanContent)
      .setThumbnail(announcement.author.displayAvatarURL({ size: 512 }))
      .setTimestamp(new Date(announcement.createdTimestamp))
      .setFooter(`From Miyako Lounge (run ${msg.guild ? msg.guild.settings.prefix : "m!"}support to join us)`);

    return msg.send({ embed });
  }
}

module.exports = Announcements;
