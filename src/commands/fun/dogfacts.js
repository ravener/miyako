const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class DogFacts extends Command {
  constructor(...args) {
    super(...args, {
      description: "Gives you a random dog fact.",
      cooldown: 5
    });
  }
  
  async run(msg) {
    const fact = await fetch("http://dog-api.kinduff.com/api/facts?number=1").json()
    return msg.send(`📢 **Dogfact:** *${fact.facts[0]}*`);
  }
}

module.exports = DogFacts;
