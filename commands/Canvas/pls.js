const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Pls extends Command {
  constructor(...args) {
    super(...args, {
      description: "Ask nicely",
      usage: "[user:member|text:string]",
      runIn: ["text"],
      aliases: ["please", "plz", "plox", "pleaze"],
      cooldown: 5
    });
  }
  
  async run(msg, [name = msg.member.displayName]) {
    if(name.displayName) name = name.displayName;
    return msg.send(new MessageAttachment(await this.client.idioticapi.pls(name), "pls.png"));
  }
}

module.exports = Pls;