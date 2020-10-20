const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class CatFace extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random cat face",
      aliases: ["catemoji"],
      cooldown: 3,
      cost: 3
    });
  }

  async run(msg) {
    const { cat } = await fetch("https://nekos.life/api/v2/cat")
      .then((res) => res.json());

    return msg.send(cat);
  }
}

module.exports = CatFace;
