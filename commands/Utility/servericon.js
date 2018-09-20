const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class ServerIcon extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns the server icon.",
      aliases: ["serverlogo"],
      runIn: ["text"],
      usage: "[server:guildname]"
    });
  }
  
  async run(msg, [guild = msg.guild]) {
    if(!guild.iconURL()) throw `There is no server icon in ${guild === msg.guild ? "this" : "that"} server.`;
    const embed = new MessageEmbed()
      .setTitle(`${guild.name}'s icon`)
      .setImage(guild.iconURL({ size: 2048 }))
      .setColor(0xff0000)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    return msg.send({ embed });
  }
}

module.exports = ServerIcon;
