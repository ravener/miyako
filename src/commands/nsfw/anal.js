const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Anal extends Command {
  constructor(...args) {
    super(...args, {
      description: "Hentai Anal",
      cooldown: 5,
      cost: 15,
      nsfw: true
    });
  }

  async run(msg) {
    const { url } = await fetch("https://nekos.life/api/v2/img/anal")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle("Hentai Anal")
      .setImage(url)
      .setFooter(`Requested by: ${msg.author.tag} | Powered by nekos.life`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.send({ embed });
  }
}

module.exports = Anal;
