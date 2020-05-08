const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Quote extends Command {
  constructor(...args) {
    super(...args, {
      description: "Quote a message by id",
      guildOnly: true,
      aliases: ["quotemsg", "msg", "message"],
      usage: "quote [#channel] <messageID>",
      botPermissions: ["EMBED_LINKS"]
    });
  }

  async run(ctx, [channeltxt, messageid]) {
    if(!channeltxt && !messageid) return ctx.reply("Baka! Give me a message ID to quote!");

    let channel = ctx.channel;
    let message = "";

    // quote <id>
    if(channeltxt && !messageid) {
      message = channeltxt;
    } else { // quote <channel> <id>
      channel = await this.verifyChannel(ctx, channeltxt);
      message = messageid;
    }

    message = await channel.messages.fetch(message)
      .catch(() => {
        throw "Message must be a valid message id.";
      });

    const embed = new MessageEmbed()
      .setTitle("Message Quote")
      .setURL(message.url)
      .setDescription(message.content)
      .setTimestamp(message.createdAt)
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 64 }))
      .setThumbnail(message.author.displayAvatarURL({ size: 64 }))
      .setImage(this.client.utils.getImage(message))
      .setColor(0x9590EE);

    return ctx.reply({ embed });
  }
}

module.exports = Quote;
