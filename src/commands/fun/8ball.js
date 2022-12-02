const Command = require("../../structures/Command.js");
const { setTimeout } = require("node:timers/promises");
const { random } = require("../../utils/utils.js");
const { stripIndents } = require("common-tags");

class Eightball extends Command {  
  constructor(...args) {
    super(...args, {
      description: "Ask the magic 8ball anything.",
      usage: "8ball <question>",
      aliases: ["eightball", "ball", "magic8"],
      options: [
        {
          name: "question",
          description: "The question to ask the magic 8ball",
          type: "string",
          required: true
        }
      ]
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
  
  async run(ctx, options) {
    const question = options.getString("question");

    await ctx.deferReply();
    await setTimeout(1000 + Math.floor(Math.random() * 2000));

    return ctx.editReply(stripIndents`
      **Question:** ${question}
      
      🎱 **${random(this.responses)}**
    `);
  }
}

module.exports = Eightball;
