const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class HentaiGIF extends Command {
  constructor(...args) {
    super(...args, {
      description: "Hentai GIF",
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ["hgif"]
    });
  }

  async run(ctx) {
    const { url } = await fetch("https://nekos.life/api/v2/img/Random_hentai_gif")
      .then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("Hentai GIF")
      .setColor(0x9590EE)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} | Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed });
  }
}

module.exports = HentaiGIF;
