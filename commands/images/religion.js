const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Religion extends Command {
  constructor(...args) {
    super(...args, {
      description: "Are you religious?",
      cooldown: 3,
      cost: 5,
      usage: "religion [@user]"
    });
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const img = await this.client.img.religion(user.displayAvatarURL({ size: 512, format: "png" }));

    return ctx.reply(new MessageAttachment(img, "religion.png"));
  }
}

module.exports = Religion;
