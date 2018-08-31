const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Facepalm extends Command {
  constructor(...args) {
    super(...args, {
      description: "Facepalm someone",
      usage: "[user:username]",
      cooldown: 5
    });
  }
  
  async run(msg, [user = msg.author]) {
    return msg.send(new MessageAttachment(await this.client.idioticapi.facepalm(user.displayAvatarURL({ format: "png", size: 2048 })), "facepalm.png"));
  }
}

module.exports = Facepalm;