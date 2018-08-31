const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Wanted extends Command {
  constructor(...args) {
    super(...args, {
      description: "Make someone wanted",
      usage: "[user:username]",
      cooldown: 5
    });
  }
  
  async run(msg, [user = msg.author]) {
    return msg.send(new MessageAttachment(await this.client.idioticapi.wanted(user.displayAvatarURL({ format: "png", size: 2048 })), "wanted.png"));
  }
}

module.exports = Wanted;