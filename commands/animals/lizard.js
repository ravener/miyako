const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Lizard extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomlizard"],
      description: "Grabs a random lizard image from nekos.life.",
      extendedHelp: "This command grabs a random lizard from https://nekos.life/api/v2/img/lizard",
      cooldown: 3
    });
  }

  async run(ctx) {
    const { url } = await fetch("https://nekos.life/api/v2/img/lizard")
      .then((res) => res.json());

    return ctx.reply(new MessageEmbed()
      .setTitle("Random Lizard")
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setImage(url));
  }
}

module.exports = Lizard;
