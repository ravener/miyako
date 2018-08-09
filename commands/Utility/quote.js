const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Quote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Quote a message by id",
      runIn: ["text"],
      aliases: ["quotemsg", "msg", "message"],
      usage: "<message:message>",
      requiredPermissions: ["EMBED_LINKS"]
    });
  }

  async run(msg, [message]) {
    const embed = new MessageEmbed()
      .setTitle("Message Quote")
      .setDescription(message.content)
      .setTimestamp(message.createdAt)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setThumbnail(message.author.displayAvatarURL());
    return msg.send({ embed });
  }
}
