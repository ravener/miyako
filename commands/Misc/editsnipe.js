const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class EditSnipe extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns last edited message in a channel",
      usage: "[channel:channelname]",
      aliases: ["edits"]
    });
  }

  async run(msg, [channel = msg.channel]) {
    if(!channel.editSnipe) throw `There isn't any sniped message in ${channel === msg.channel ? "this" : "that"} channel.`;
    const { old, message } = channel.editSnipe;
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle("Edit Sniped")
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTimestamp(message.createdAt)
      .setDescription(`**Before** ${old.content}\n\n**New** ${message.content}`);
    return msg.send({ embed });
  }
}

module.exports = EditSnipe;
