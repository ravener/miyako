const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Beautiful extends Command {
  constructor(...args) {
    super(...args, {
      description: "Oh this, this is beautiful",
      cooldown: 5,
      usage: "[user:user]"
    });
  }

  async run(msg, [user = msg.author]) {
    return msg.send(new MessageAttachment(await this.client.idioticapi.beautiful(user.displayAvatarURL({ format: "png", size: 2048 })), "beautiful.png"));
  }
}

module.exports = Beautiful;
