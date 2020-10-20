const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Patrick extends Command {
  constructor(...args) {
    super(...args, {
      cooldown: 3,
      cost: 5,
      usage: "patrick [@user]"
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const img = await this.client.img.patrick(user.displayAvatarURL({ size: 512, format: "png" }));

    return msg.send(new MessageAttachment(img, "patrick.png"));
  }
}

module.exports = Patrick;
