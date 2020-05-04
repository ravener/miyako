const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Duck extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomduck", "ducc"],
      description: "Grabs a random duck image from random-d.uk.",
      extendedHelp: "This command grabs a random duck from https://random-d.uk/api/v1/random",
      cooldown: 3
    });
  }

  async run(ctx) {
    const { url } = await fetch("https://random-d.uk/api/v1/random")
      .then((res) => res.json());

    return ctx.reply(new MessageEmbed()
      .setTitle("Random Duck")
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setImage(url));
  }
}

module.exports = Duck;
