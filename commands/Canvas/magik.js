const { Command } = require("klasa");
const { get } = require("superagent");
const { MessageEmbed } = require("discord.js");

class Magik extends Command {
  constructor(...args) {
    super(...args, {
      description: "Magik someone",
      usage: "[url:url|user:username]",
      cooldown: 5
    });
  }

  async run(msg, [user = msg.author]) {
    const url = user.displayAvatarURL ? user.displayAvatarURL({
      format: "png",
      size: 2048
    }) : user;
    const res = await get("https://nekobot.xyz/api/imagegen")
      .query({ type: "magik", image: url });
    const embed = new MessageEmbed()
      .setAuthor(user.tag, user.displayAvatarURL())
      .setColor(0xff0000)
      .setImage(res.body.message);
    return msg.send({ embed });
  }
}

module.exports = Magik;
