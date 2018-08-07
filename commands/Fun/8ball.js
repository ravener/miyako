const { Command, util: { codeBlock } } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");
const { random } = require("../../utils/utils.js");

class Eightball extends Command {  
  constructor(...args) {
    super(...args, {
      description: "Ask the magic 8ball anything.",
      usage: "<question:string>",
      aliases: ["eightball", "ball"]
    });
    
    this.responses = [
      "It is certain",
      "It is decidedly so",
      "without a doubt",
      "Yes definitely",
      "You may rely on it",
      "As I see it, Yes",
      "Most likely",
      "Outlook good",
      "Yes",
      "Signs point to yes",
      "Reply hazy try again",
      "Ask again later",
      "Better not tell you now",
      "Cannot predict now",
      "Concentrate and ask again",
      "Dont count on it",
      "My reply is no",
      "My sources say no",
      "Outlook not so good",
      "Very doubtful"
    ];
  }
  
  async run(msg, [question]) {
    const res = random(this.responses);
    return msg.send(`**Question:**${codeBlock("", escapeMarkdown(question, true))}\n**8ball:**${codeBlock("", res)}`);
  } 
}

module.exports = Eightball;