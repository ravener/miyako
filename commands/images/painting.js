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

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const img = await this.client.img.painting(user.displayAvatarURL({ size: 512, format: "png" }));

    return ctx.reply(new MessageAttachment(img, "painting.png"));
  }
}

module.exports = Painting;
