const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const { getAttachment } = require("../../utils/utils.js");

class Quote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Quote a message by id",
      runIn: ["text"],
      aliases: ["quotemsg", "msg", "message"],
      usage: "[channel:channel] <messageID:string>",
      requiredPermissions: ["EMBED_LINKS"],
      usageDelim: " ",
      quotedStringSupport: true
    });
  }

  async run(msg, [channel = msg.channel, message]) {
    message = await channel.messages.fetch(message)
      .catch(() => {
        throw "Message must be a valid message id.";
      });
    const embed = new MessageEmbed()
      .setTitle("Message Quote")
      .setURL(message.url)
      .setDescription(message.content)
      .setTimestamp(message.createdAt)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL())
      .setImage(getAttachment(message))
      .setColor(0xff0000);
    return msg.send({ embed });
  }
}

module.exports = Quote;
