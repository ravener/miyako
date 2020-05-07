const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Smug extends Command {
  constructor(...args) {
    super(...args, {
      description: "Someone feels a bit smug",
      cooldown: 3,
      cost: 5
    });
  }

  async run(ctx) {
    const { url } = await fetch("https://nekos.life/api/v2/img/smug")
      .then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("Smug")
      .setColor(0x9590EE)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} | Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed });
  }
}

module.exports = Smug;
