const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Delete extends Command {
  constructor(...args) {
    super(...args, {
      description: "Delet this",
      cooldown: 3,
      cost: 5,
      usage: "delete [@user]"
    });
  }

  async run(msg, [user]) {
    user = await this.verifyUser(msg, user, true);

    const img = await this.client.img.delete(user.displayAvatarURL({ size: 256, format: "png" }));

    return msg.send(new MessageAttachment(img, "delete.png"));
  }
}

module.exports = Delete;
