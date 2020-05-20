const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Truth extends Command {
  constructor(...args) {
    super(...args, {
      description: "The truth is under the paper",
      cooldown: 3,
      cost: 5,
      usage: "truth [@user]"
    });
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const img = await this.client.img.truth(user.displayAvatarURL({ size: 256, format: "png" }));

    return ctx.reply(new MessageAttachment(img, "truth.png"));
  }
}

module.exports = Truth;
