const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Lesbian extends Command {
  constructor(...args) {
    super(...args, {
      description: "Lesbian Hentai",
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ["les"]
    });
  }

  async run(msg) {
    const { url } = await fetch("https://nekos.life/api/v2/img/les")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle("Lesbian Hentai")
      .setImage(url)
      .setFooter(`Requested by: ${msg.author.tag} | Powered by nekos.life`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.send({ embed });
  }
}

module.exports = Lesbian;
