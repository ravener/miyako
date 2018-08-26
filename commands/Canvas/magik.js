const { Command } = require("klasa");
const { get } = require("superagent");
const { MessageEmbed } = require("discord.js");

class Magik extends Command {
  constructor(...args) {
    super(...args, {
      description: "Magik someone",
      usage: "[user:username]",
      cooldown: 5
    });
  }

  async run(msg, [user = msg.author]) {
    const res = await get("https://nekobot.xyz/api/imagegen")
      .query({ type: "magik", image: user.displayAvatarURL({ format: "png", size: 2048 }) });
    const embed = new MessageEmbed()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setColor(0xff0000)
      .setImage(res.body.message);
    return msg.send({ embed });
  }
}

module.exports = Magik;
