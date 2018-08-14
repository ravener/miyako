const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Triggered extends Command {
  constructor(...args) {
    super(...args, {
      description: "Makes your or someone triggered",
      cooldown: 5,
      usage: "[user:username]"
    });
  }
  
  async run(msg, [user = msg.author]) {
    await msg.send(new MessageAttachment(await this.client.idioticapi.triggered(user.displayAvatarURL({ size: 2048, format: "png" })), "triggered.gif"));
  }
}

module.exports = Triggered;
