const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { get } = require("superagent");

class Blurple extends Command {
  constructor(...args) {
    super(...args, {
      description: "Blurpify someone",
      cooldown: 5,
      usage: "[user:username]",
      aliases: ["blurpify"]
    });
  }
  
  async run(msg, [user = msg.author]) {
    const image = await get("https://nekobot.xyz/api/imagegen")
      .query({ type: "blurpify", image: user.displayAvatarURL({ size: 2048, format: "png" }) })
      .then((r) => r.body.message);
    const embed = new MessageEmbed()
      .setTitle("Blurpify")
      .setImage(image)
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    return msg.send({ embed });
  }
}

module.exports = Blurple;
