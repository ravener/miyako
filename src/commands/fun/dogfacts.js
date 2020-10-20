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
    const fact = await fetch("http://dog-api.kinduff.com/api/facts?number=1")
      .then((res) => res.json())
      .then((body) => body.facts[0]);
    return msg.send(`📢 **Dogfact:** *${fact}*`);
  }
}

module.exports = DogFacts;
