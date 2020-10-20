const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class TrumpQuote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns a random Donald Trump quote.",
      cooldown: 3
    });
  }
  
  async run(msg) {
    const { value } = await fetch("https://api.tronalddump.io/random/quote")
      .then((res) => res.json());
    return msg.send(value);
  }
}

module.exports = TrumpQuote;
