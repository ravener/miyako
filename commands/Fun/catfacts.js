const { Command } = require("klasa");
const { get } = require("superagent");

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
    const fact = await get("https://catfact.ninja/fact")
      .then((res) => res.body.fact);
    return msg.sendMessage(`📢 **Catfact:** *${fact}*`);
  }
}

module.exports = CatFacts;
