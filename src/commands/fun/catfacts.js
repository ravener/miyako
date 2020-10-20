const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class CatFacts extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["catfact", "kittenfact"],
      cooldown: 3,
      description: "Let me tell you a misterious cat fact."
    });
    this.cost = 10;
  }
  
  async run(msg) {
    const fact = await fetch("https://catfact.ninja/fact")
      .then((res) => res.json())
      .then(({ fact }) => fact);

    return msg.send(`📢 **Catfact:** *${fact}*`);
  }
}

module.exports = CatFacts;
