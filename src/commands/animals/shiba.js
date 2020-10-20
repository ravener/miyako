const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Shibe extends Command {
  constructor(...args) {
    super(...args, {
      description: "Post a randomly selected image of a Shiba Inu.",
      extended: "This command will return a beautiful Shiba Inu.",
      cost: 5,
      cooldown: 3,
      aliases: ["doge", "shib", "shibe", "shibainu"],
      botPermissions: ["EMBED_LINKS"]
    });
  }

  async run(msg) {
    const [url] = await fetch("https://shibe.online/api/shibes")
      .then((res) => res.json());

    const embed = this.client.embed()
      .setTitle("Shiba Inu")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setImage(url);

    return msg.send({ embed });
  }
}

module.exports = Shibe;
