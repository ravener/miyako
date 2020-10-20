const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class SmallBoobs extends Command {
  constructor(...args) {
    super(...args, {
      description: "Hentai Small boobs",
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ["sboobs"]
    });
  }

  async run(msg) {
    const { url } = await fetch("https://nekos.life/api/v2/img/smallboobs")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle("Hentai Small Boobs")
      .setImage(url)
      .setFooter(`Requested by: ${msg.author.tag} | Powered by nekos.life`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.send({ embed });
  }
}

module.exports = SmallBoobs;
