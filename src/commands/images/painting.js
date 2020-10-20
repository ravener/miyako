const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Painting extends Command {
  constructor(...args) {
    super(...args, {
      description: "Painting that kills you if you look at it",
      cooldown: 3,
      cost: 5,
      usage: "painting [@user]"
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const img = await this.client.img.painting(user.displayAvatarURL({ size: 512, format: "png" }));

    return msg.send(new MessageAttachment(img, "painting.png"));
  }
}

module.exports = Painting;
