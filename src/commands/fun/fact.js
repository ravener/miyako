const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class Fact extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a random fact.",
      aliases: ["facts", "randomfact", "randomfacts"],
      cooldown: 3
    });
  }

  async run(msg) {
    const { fact } = await fetch("https://nekos.life/api/v2/fact")
      .then((res) => res.json());

    return msg.send(fact);
  }
}

module.exports = Fact;
