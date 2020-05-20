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

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const img = await this.client.img.delete(user.displayAvatarURL({ size: 256, format: "png" }));

    return ctx.reply(new MessageAttachment(img, "delete.png"));
  }
}

module.exports = Delete;
