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

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const img = await this.client.img.picture(user.displayAvatarURL({ size: 1024, format: "png" }));

    return ctx.reply(new MessageAttachment(img, "picture.png"));
  }
}

module.exports = Picture;
