const { Command, Timestamp } = require("klasa");
const { MessageEmbed } = require("discord.js");

class News extends Command {
  constructor(...args) {
    super(...args, {
      description: "See the latest bot news.",
      aliases: ["announcements", "updates", "botupdates"],
      cooldown: 5,
      guarded: true,
      requiredPermissions: ["EMBED_LINKS"]
    });
    this.timestamp = new Timestamp("d MMMM YYYY");
  }
  
  async run(msg) {
    const news = this.client.settings.psa.message;
    const date = new Date(this.client.settings.psa.date);
    if(!news || !date) throw "There is no any news at this time, check back later.";
    const embed = new MessageEmbed()
      .setTitle("Bot Announcements")
      .setThumbnail(this.client.user.avatarURL())
      .setColor(0xff0000)
      .setDescription(news)
      .setAuthor(this.client.owner.tag, this.client.owner.avatarURL())
      .setFooter(`Published at ${this.timestamp.display(date)}`);
    return msg.send({ embed });
  }
}

module.exports = News;