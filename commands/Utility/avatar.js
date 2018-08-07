const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Avatar extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns someone's profile picture or yours",
      aliases: ["av", "pfp"],
      usage: "[user:user]"
    });
  }
  
  async run(message, [user = message.author]) {
    const embed = new MessageEmbed()
      .setTitle(`${user.tag}'s avatar`)
      .setImage(user.displayAvatarURL({ size: 2048 }).replace(/webp/, "png"))
      .setColor(0xff0000)
      .setAuthor(message.author.tag, message.author.avatarURL());
    return message.send({ embed });
  }
}

module.exports = Avatar;