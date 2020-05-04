const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Cat extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a picture of a random cat!",
      cooldown: 3,
      aliases: ["meow", "catpic", "randomcat"]
    });
  }

  async run(ctx) {
    const file = await fetch("https://aws.random.cat/meow")
      .then((res) => res.json())
      .then((body) => body.file);

    const embed = new MessageEmbed()
      .setTitle("Random Cat")
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setImage(file);
    return ctx.reply({ embed });
  }
}

module.exports = Cat;
