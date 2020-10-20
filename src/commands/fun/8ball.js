const Command = require("../../structures/Command.js");

class Eightball extends Command {  
  constructor(...args) {
    super(...args, {
      description: "Ask the magic 8ball anything.",
      usage: "8ball <question>",
      aliases: ["eightball", "ball", "magic8"]
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
    if(!question) return msg.send("Baka! What do you want to ask?");
    const sent = await msg.send(`${this.client.constants.typing} **8ball** is thinking...`);
    await this.client.utils.sleep(1500);
    return sent.edit(`**${this.client.utils.random(this.responses)}**`);
  }
}

module.exports = Eightball;
