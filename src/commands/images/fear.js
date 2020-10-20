const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Fear extends Command {
  constructor(...args) {
    super(...args, {
      description: "I fear no man",
      cooldown: 3,
      cost: 5,
      usage: "fear [@user]"
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const img = await this.client.img.fear(user.displayAvatarURL({ size: 256, format: "png" }));

    return msg.send(new MessageAttachment(img, "fear.png"));
  }
}

module.exports = Fear;
