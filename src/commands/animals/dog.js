const Command = require("../../structures/Command.js");

const fetch = require("node-fetch");

class Dog extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["randomdog", "woof"],
      description: "Grabs a random dog image from random.dog.",
      extendedHelp: "This command grabs a random dog from https://dog.ceo/api/breeds/image/random",
      cooldown: 3
    });
  }
  
  async run(msg) {
    const { message } = await fetch("https://dog.ceo/api/breeds/image/random")
      .then((res) => res.json());

    return msg.send(this.client.embed()
      .setTitle(msg.tr("COMMAND_DOG_TITLE"))
      .setImage(message)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 })));
  }
}

module.exports = Dog;
