const { Command } = require("klasa");
const ladybug = require("ladybug-fetch");
const path = require("path");

class Cat extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a picture of a random cat!",
      cooldown: 3,
      aliases: ["meow", "catpic", "randomcat"]
    });
  }

  async run(msg) {
    const file = await ladybug("https://aws.random.cat/meow")
      .then((res) => res.body.file);
    return msg.channel.sendFile(file, `cat${path.extname(file)}`);
  }
}

module.exports = Cat;
