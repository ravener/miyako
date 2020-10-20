const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");


class Duck extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomduck", "ducc"],
      description: "Grabs a random duck image from random-d.uk.",
      extendedHelp: "This command grabs a random duck from https://random-d.uk/api/v1/random",
      cooldown: 3
    });
  }

  async run(msg) {
    const { url } = await fetch("https://random-d.uk/api/v1/random")
      .then((res) => res.json());

    return msg.send(this.client.embed()
      .setTitle("Random Duck")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setImage(url));
  }
}

module.exports = Duck;
