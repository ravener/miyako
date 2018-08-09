const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Blame extends Command {
  constructor(...args) {
    super(...args, {
      description: "Blame someone or something.",
      cooldown: 5,
      usage: "[user:member|text:string]",
      runIn: ["text"]
    });
  }
  
  async run(msg, [text = msg.member.displayName]) {
    return await msg.send(new MessageAttachment(await this.client.idioticapi.blame(text), "blame.png"));
  }
}

module.exports = Blame;