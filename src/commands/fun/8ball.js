const Command = require("../../structures/Command.js");

class Eightball extends Command {  
  constructor(...args) {
    super(...args, {
      description: "Ask the magic 8ball anything.",
      usage: "8ball <question>",
      aliases: ["eightball", "ball", "magic8"]
    });
   
    // TODO: Translate these
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
    if(!question) return msg.sendLocale("COMMAND_8BALL_ASK");
    // Reuse the translation from choose command.
    const sent = await msg.sendLocale("COMMAND_CHOOSE_THINKING", ["8ball"]);
    await this.client.utils.sleep(1500);
    return sent.edit(`🎱 **${this.client.utils.random(this.responses)}**`);
  }
}

module.exports = Eightball;
