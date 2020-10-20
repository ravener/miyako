const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Baka extends Command {
  constructor(...args) {
    super(...args, {
      description: "Baka baka baka!",
      cooldown: 3,
      cost: 5
    });
  }

  async run(msg) {
    const { url } = await fetch("https://nekos.life/api/v2/img/baka")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle("Baka")
      .setImage(url)
      .setFooter(`Requested by: ${msg.author.tag} | Powered by nekos.life`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.send({ embed });
  }
}

module.exports = Baka;
