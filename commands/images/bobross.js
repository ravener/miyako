const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Bobross extends Command {
  constructor(...args) {
    super(...args, {
      cooldown: 3,
      cost: 5,
      usage: "bobross [@user]"
    });
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const img = await this.client.img.bobross(user.displayAvatarURL({ size: 512, format: "png" }));

    return ctx.reply(new MessageAttachment(img, "bobross.png"));
  }
}

module.exports = Bobross;
