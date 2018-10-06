const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const ladybug = require("ladybug-fetch");

class Cat extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a picture of a random cat!",
      cooldown: 3,
      aliases: ["meow", "catpic", "randomcat"]
    });
  }

  async run(msg) {
    const file = await ladybug("https://aws.random.cat/meow")
      .then((res) => res.body.file);
    const embed = new MessageEmbed()
      .setTitle("Random Cat")
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setImage(file);
    return msg.send({ embed });
  }
}

module.exports = Cat;
