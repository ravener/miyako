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

  async run(msg, [user, ...args]) {
    user = await this.verifyUser(msg, user, true)
      .catch(() => {
        args.unshift(user);
        return msg.author;
      });

    if(!args.length) return msg.send("Baka! You need to provide some text.");

    const text = args.join(" ");

    if(text.length > 21) return msg.send("Baka! Text cannot be longer than 21 characters.");

    const img = await this.client.img.achievement(user.displayAvatarURL({ size: 64, format: "png" }), text);

    return msg.send(new MessageAttachment(img, "achievement.png"));
  }
}

module.exports = Achievement;
