const { Command } = require("klasa");
const { get } = require("superagent");

class NumberFact extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a fact about a number or random number",
      usage: "(number:numfact)",
      cooldown: 5,
      aliases: ["numfact", "numfacts", "num", "number", "number-fact", "number-facts"]
    });

    this.createCustomResolver("numfact", (arg, possible, msg) => {
      if(!arg || arg.toLowerCase() === "random") return "random";
      return this.client.arguments.get("integer").run(arg, possible, msg);
    });
  }

  async run(msg, [number]) {
    const { text } = await get(`http://numbersapi.com/${number}`);
    return msg.send(`**${text}**`);
  }
}

module.exports = NumberFact;
