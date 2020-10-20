const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Garbage extends Command {
  constructor(...args) {
    super(...args, {
      description: "I'm full of garbage",
      cooldown: 3,
      cost: 5,
      usage: "garbage [@user]"
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const img = await this.client.img.garbage(user.displayAvatarURL({ size: 512, format: "png" }));

    return msg.send(new MessageAttachment(img, "garbage.png"));
  }
}

module.exports = Garbage;
