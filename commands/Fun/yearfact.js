const { Command } = require("klasa");
const superagent = require("superagent");

class YearFact extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a fact about a year or random year",
      cooldown: 5,
      usage: "(year:year)",
      aliases: ["year", "year-fact", "yearfacts", "year-facts"]
    });

    this.createCustomResolver("year", (arg, possible, msg) => {
      if(!arg || arg.toLowerCase() === "random") return "random";
      return this.client.arguments.get("integer").run(arg, possible, msg);
    });
  }
  
  async run(msg, [year]) {
    const { text } = await superagent.get(`http://numbersapi.com/${year}/year`);
    return msg.send(`**${text}**`);
  }
}

module.exports = YearFact;
