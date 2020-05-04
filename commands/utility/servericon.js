const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class ServerIcon extends Command {
  constructor(...args) {
    super(...args, {
      description: "Returns the server icon.",
      aliases: ["serverlogo"],
      guildOnly: true
    });
  }
  
  async run(ctx) {
    if(!ctx.guild.iconURL()) throw "There is no server icon in this server. What do you expect me to show you?";
    const embed = new MessageEmbed()
      .setTitle(`${ctx.guild.name}'s icon`)
      .setImage(ctx.guild.iconURL({ size: 2048 }))
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }));
    return ctx.reply({ embed });
  }
}

module.exports = ServerIcon;
