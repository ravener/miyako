const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Pussy extends Command {
  constructor(...args) {
    super(...args, {
      description: (msg) => msg.tr("COMMAND_PUSSY"),
      cooldown: 5,
      cost: 15,
      nsfw: true
    });
  }

  async run(msg) {
    const { url } = await fetch("https://nekos.life/api/v2/img/pussy")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle(msg.tr("COMMAND_PUSSY"))
      .setImage(url)
      .setFooter(`Requested by: ${msg.author.tag} | Powered by nekos.life`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.send({ embed });
  }
}

module.exports = Pussy;
