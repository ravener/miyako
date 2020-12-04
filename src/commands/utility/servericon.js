const Command = require("../../structures/Command.js");


class ServerIcon extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns the server icon.",
      aliases: ["serverlogo"],
      guildOnly: true
    });
  }
  
  async run(msg) {
    if(!msg.guild.iconURL()) throw "There is no server icon in this server. What do you expect me to show you?";
    const embed = this.client.embed()
      .setTitle(msg.tr("COMMAND_SERVERICON_TITLE", msg.guild.name))
      .setImage(msg.guild.iconURL({ size: 2048 }))
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }));
    return msg.send({ embed });
  }
}

module.exports = ServerIcon;
