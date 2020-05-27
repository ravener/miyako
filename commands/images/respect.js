const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Respect extends Command {
  constructor(...args) {
    super(...args, {
      description: "Press F to pay respect",
      cooldown: 3,
      cost: 5,
      usage: "respect [@user]"
    });
  }

  async run(ctx, [user]) {
    user = await this.verifyUser(ctx, user, true);

    const img = await this.client.img.respect(user.displayAvatarURL({ size: 128, format: "png" }));

    const m = await ctx.reply("Press 🇫 to pay respects", new MessageAttachment(img, "respect.png"));
    return m.react("🇫");
  }
}

module.exports = Respect;
