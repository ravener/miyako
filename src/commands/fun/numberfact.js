const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class NumberFact extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a fact about a number or random number",
      usage: "numberfact [number|random]",
      cooldown: 5,
      aliases: ["numfact", "numfacts", "num", "number", "number-fact", "number-facts"]
    });
  }

  async run(msg, [number = "random"]) {
    if(number !== "random" && isNaN(parseInt(number))) return msg.send("Baka! Does that look like a number to you?");
    const text = await fetch(`http://numbersapi.com/${number}`).then((res) => res.text());
    return msg.send(`**${text}**`);
  }
}

module.exports = NumberFact;
