const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class LewdNekoGIF extends Command {
  constructor(...args) {
    super(...args, {
      description: "Lewd Neko Hentai GIF",
      cooldown: 5,
      cost: 15,
      nsfw: true,
      aliases: ["lnekogif", "lewdnekogif"]
    });
  }

  async run(msg) {
    const { url } = await fetch("https://nekos.life/api/v2/img/nsfw_neko_gif")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle("Lewd Neko GIF")
      .setImage(url)
      .setFooter(`Requested by: ${msg.author.tag} | Powered by nekos.life`, msg.author.displayAvatarURL({ size: 32 }));

    return msg.send({ embed });
  }
}

module.exports = LewdNekoGIF;
