const { Command } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");

class Choose extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pick a random choice!",
      extendedHelp: "Seperate choices with a comma.",
      usage: "<choices:string> [...]",
      usageDelim: ",",
      aliases: ["choice", "pick"]
    });
  }
  
  async run(msg, choices) {
    if(choices.length < 2) throw "Not enough choices to pick from, seperate your choices with a comma.";
    const choice = choices[Math.floor(Math.random() * choices.length)];
    return msg.send(`I think \`${escapeMarkdown(choice.trim(), true)}\``);
  }
}

module.exports = Choose;