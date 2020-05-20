const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Bed extends Command {
  constructor(...args) {
    super(...args, {
      description: "There is a monster under my bed!",
      cooldown: 3,
      cost: 5,
      usage: "bed <@user> [@user]"
    });
  }

  async run(ctx, [user, another]) {
    user = await this.verifyUser(ctx, user);
    another = await this.verifyUser(ctx, another, true);

    const img = await this.client.img.bed(user.displayAvatarURL({ size: 128, format: "png" }),
      another.displayAvatarURL({ size: 128, format: "png" }));

    return ctx.reply(new MessageAttachment(img, "bed.png"));
  }
}

module.exports = Bed;
