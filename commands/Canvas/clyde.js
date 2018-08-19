const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

class Clyde extends Command {
  constructor(...args) {
    super(...args, {
      description: "Say something as Clyde",
      cooldown: 5,
      usage: "<text:string>"
    });
  }

  async run(msg, [text]) {
    const image = await superagent.get("https://nekobot.xyz/api/imagegen")
      .query({ type: "clyde", text })
      .then((res) => res.body.message);
    const embed = new MessageEmbed()
      .setTitle("Clyde")
      .setColor(0xff0000)
      .setImage(image)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    return msg.send({ embed });
  }
}

module.exports = Clyde;
