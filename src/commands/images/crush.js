const Command = require("../../structures/Command.js");
const { MessageAttachment } = require("discord.js");

class Crush extends Command {
  constructor(...args) {
    super(...args, {
      cooldown: 3,
      cost: 5,
      usage: "crush <@user> [@user]"
    });
  }

  async run(msg, [user, another]) {
    user = await this.verifyUser(msg, user);
    another = await this.verifyUser(msg, another, true);

    const img = await this.client.img.crush(user.displayAvatarURL({ size: 512, format: "png" }),
      another.displayAvatarURL({ size: 512, format: "png" }));

    return msg.send(new MessageAttachment(img, "crush.png"));
  }
}

module.exports = Crush;
