const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Achievement extends Command {
  constructor(...args) {
    super(...args, {
      description: "Achievement Get!",
      cooldown: 3,
      cost: 5,
      usage: "achievement [@user] <text>"
    });
  }

  async run(ctx, [user, ...args]) {
    user = await this.verifyUser(ctx, user, true)
      .catch(() => {
        args.unshift(user);
        return ctx.author;
      });

    if(!args.length) return ctx.reply("Baka! You need to provide some text.");

    const text = args.join(" ");

    if(text.length > 21) return ctx.reply("Baka! Text cannot be longer than 21 characters.");

    const img = await this.client.img.achievement(user.displayAvatarURL({ size: 64, format: "png" }), text);

    return ctx.reply(new MessageAttachment(img, "achievement.png"));
  }
}

module.exports = Achievement;
