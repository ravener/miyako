const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Lizard extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomlizard"],
      description: "Grabs a random lizard image from nekos.life.",
      extendedHelp: "This command grabs a random lizard from https://nekos.life/api/v2/img/lizard",
      cooldown: 3
    });
  }

  async run(msg) {
    const { url } = await fetch("https://nekos.life/api/v2/img/lizard")
      .then((res) => res.json());

    return msg.send(this.client.embed()
      .setTitle("Random Lizard")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setImage(url));
  }
}

module.exports = Lizard;
