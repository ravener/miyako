const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class YearFact extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a fact about a year or random year",
      cooldown: 5,
      usage: "yearfact [year|random]",
      aliases: ["year", "year-fact", "yearfacts", "year-facts"]
    });
  }
  
  async run(msg, [year = "random"]) {
    if(year !== "random" && isNaN(parseInt(year))) return msg.send("Baka! Does that look like a year to you?");
    const text = await fetch(`http://numbersapi.com/${year}/year`).then((res) => res.text());
    return msg.send(`**${text}**`);
  }
}

module.exports = YearFact;
