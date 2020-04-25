const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Bird extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a picture of a random bird!",
      cooldown: 3,
      aliases: ["birb", "randombirb", "randombird"]
    });
  }

  async run(ctx) {
    const file = await fetch("http://random.birb.pw/tweet")
      .then((res) => res.text());

    const embed = new MessageEmbed()
      .setTitle("Random Bird")
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 256 }))
      .setImage(`https://random.birb.pw/img/${file}`);
    return ctx.reply({ embed });
  }
}

module.exports = Bird;
