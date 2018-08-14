const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Snipe extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns last deleted message in a channel",
      usage: "[channel:channelname]",
      runIn: ["text"]
    });
  }
  
  async run(msg, [channel = msg.channel]) {
    if(!channel.snipe) throw `There isn't any sniped message in ${channel === msg.channel ? "this" : "that"} channel.`;
    const embed = new MessageEmbed()
      .setTitle("Message Sniped")
      .setDescription(channel.snipe.content)
      .setAuthor(channel.snipe.author.tag, channel.snipe.author.displayAvatarURL())
      .setFooter(`Sent by ${channel.snipe.author.tag}`)
      .setTimestamp(channel.snipe.createdAt)
      .setColor(0xff0000);
    return msg.send({ embed });
  }
}

module.exports = Snipe;
