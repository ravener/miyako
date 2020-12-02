const Command = require("../../structures/Command.js");

const fetch = require("node-fetch");

class Cat extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a picture of a random cat!",
      cooldown: 3,
      aliases: ["meow", "catpic", "randomcat"]
    });
  }

  async run(msg) {
    const file = await fetch("https://aws.random.cat/meow")
      .then((res) => res.json())
      .then((body) => body.file);

    const embed = this.client.embed()
      .setTitle(msg.tr("COMMAND_CAT_TITLE"))
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setImage(file);
    return msg.send({ embed });
  }
}

module.exports = Cat;
