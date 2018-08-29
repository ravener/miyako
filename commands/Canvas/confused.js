const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Confused extends Command {
  constructor(...args) {
    super(...args, {
      description: "How confused you are?",
      usage: "[user:user]",
      runIn: ["text"],
      cooldown: 5
    });
  }
  
  async run(msg, [user = msg.author]) {
    return msg.send(new MessageAttachment(await this.client.idioticapi.confused(user.displayAvatarURL({ format: "png", size: 1024 }), msg.guild.members.random().user.displayAvatarURL({ format: "png", size: 1024 })), "confused.png"));
  }
}

module.exports = Confused;