const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Dog extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomdog", "woof"],
      description: "Grabs a random dog image from random.dog.",
      extendedHelp: "This command grabs a random dog from https://dog.ceo/api/breeds/image/random",
      cooldown: 3
    });
  }
  
  async run(ctx) {
    const { message } = await fetch("https://dog.ceo/api/breeds/image/random")
      .then((res) => res.json());

    return ctx.reply(new MessageEmbed()
      .setTitle("Random Dog")
      .setImage(message)
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 })));
  }
}

module.exports = Dog;
