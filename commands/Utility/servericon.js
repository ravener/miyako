const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class ServerIcon extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns the server icon.",
      aliases: ["serverlogo"],
      runIn: ["text"]
    });
  }
  
  async run(msg) {
    if(!msg.guild.iconURL()) throw "There is not server icon in this server.";
    const embed = new MessageEmbed()
      .setTitle(`${msg.guild.name}'s icon`)
      .setImage(msg.guild.iconURL({ size: 2048 }))
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    return msg.send({ embed });
  }
}

module.exports = ServerIcon;
