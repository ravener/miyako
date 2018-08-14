const { Command } = require("klasa");
const { MessageAttachment } = require("discord.js");

class Sniper extends Command {
  constructor(...args) {
    super(...args, {
      description: "Snipe someone",
      usage: "[user:username]",
      cooldown: 5
    });
  }

  async run(msg, [user = msg.author]) {
    return msg.send(new MessageAttachment(await this.client.idioticapi.sniper(user.displayAvatarURL({ format: "png", size: 2048 })), "sniper.png"));
  }
}

module.exports = Sniper;
