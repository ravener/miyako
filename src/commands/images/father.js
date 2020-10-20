const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Father extends Command {
  constructor(...args) {
    super(...args, {
      description: "As a father it's my job to respect my son's opinions",
      cooldown: 3,
      cost: 5,
      usage: "father [@user] <text>"
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

    if(text.length > 42) return msg.send("Baka! Text cannot be longer than 42 characters.");

    const img = await this.client.img.father(user.displayAvatarURL({ size: 256, format: "png" }), text);

    return msg.send(new MessageAttachment(img, "father.png"));
  }
}

module.exports = Father;
