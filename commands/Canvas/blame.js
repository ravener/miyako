const { Command } = require("klasa");

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
    return await msg.sendFile(await this.client.idioticapi.blame(text));
  }
}

module.exports = Blame;