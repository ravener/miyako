const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Picture extends Command {
  constructor(...args) {
    super(...args, {
      description: "I love this picture.",
      cooldown: 3,
      cost: 5,
      usage: "picture [@user]"
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const img = await this.client.img.picture(user.displayAvatarURL({ size: 1024, format: "png" }));

    return msg.send(new MessageAttachment(img, "picture.png"));
  }
}

module.exports = Picture;
