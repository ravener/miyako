const { Command } = require("klasa");
const superagent = require("superagent");

class YearFact extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get a fact about a year or random year",
      cooldown: 5,
      usage: "(year:int)",
      aliases: ["year", "year-fact"]
    });
  }
  
  async run(msg, [year = "random"]) {
    const fact = await superagent.get(`http://numbersapi.com/${year}/year`)
      .then((res) => res.text)
      .catch(() => null);
    if(!fact) throw "Couldn't find a fact, try again with another year.";
    return msg.send(`**${fact}**`);
  }
}

module.exports = YearFact;