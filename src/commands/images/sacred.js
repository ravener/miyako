const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Sacred extends Command {
  constructor(...args) {
    super(...args, {
      description: "The ancient sacred texts",
      cooldown: 3,
      cost: 5,
      usage: "sacred [@user]"
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const img = await this.client.img.sacred(user.displayAvatarURL({ size: 512, format: "png" }));

    return msg.send(new MessageAttachment(img, "sacred.png"));
  }
}

module.exports = Sacred;
