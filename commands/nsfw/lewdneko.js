const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class LewdNeko extends Command {
  constructor(...args) {
    super(...args, {
      description: "Lewd Neko Hentai",
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ["lneko"]
    });
  }

  async run(ctx) {
    const { url } = await fetch("https://nekos.life/api/v2/img/lewd")
      .then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("Lewd Neko")
      .setColor(0x9590EE)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} | Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed });
  }
}

module.exports = LewdNeko;
