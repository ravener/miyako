const { Command } = require("klasa");

class Triggered extends Command {
  constructor(...args) {
    super(...args, {
      description: "Makes your or someone triggered",
      cooldown: 5,
      usage: "[user:user]"
    });
  }
  
  async run(msg, [user = msg.author]) {
    await msg.sendFile(await this.client.idioticapi.triggered(user.displayAvatarURL({ size: 2048, format: "png" })));
  }
}

module.exports = Triggered;