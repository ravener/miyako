const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const ladybug = require("ladybug-fetch");
const cheerio = require("cheerio");

class FML extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random fuckmylife story",
      cooldown: 5,
      aliases: ["fuckmylife", "fmylife"]
    });
    this.cost = 10;
  }
  
  async run(message) {
    const $ = await ladybug("https://www.fmylife.com/random")
      .then((res) => cheerio.load(res.text))
      .catch(() => null);
    if(!$) throw "Something went wrong, please try again later.";
    const text = $("p.block").first().text();
    const embed = new MessageEmbed()
      .setTitle("Fuck My Life")
      .setColor(0xff0000)
      .setDescription(text)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setFooter("Powered by fmylife.com");
    return message.send({ embed });
  }
}

module.exports = FML;
