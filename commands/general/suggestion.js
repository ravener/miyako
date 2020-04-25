const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Suggestion extends Command {
  constructor(...args) {
    super(...args, {
      description: "Got a suggestion to improve the bot?",
      usage: "suggestion <idea>",
      aliases: ["suggest"],
      cooldown: 60
    });
  }
  
  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! What's your idea?");

    const channel = this.client.channels.get("460801007769616394");

    const embed = new MessageEmbed()
      .setTitle("New Suggestion")
      .setDescription(args.join(" "))
      .setColor(0x9590EE)
      .setThumbnail(ctx.author.displayAvatarURL({ size: 512 }))
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 512 }))
      .setFooter(`User ID: ${ctx.author.id}`);

    const message = await channel.send({ embed });
    await message.react("466669198463074305");
    await message.react("466669201025925120");
    return ctx.reply(`Your idea has been successfully submitted${ctx.guild && ctx.guild.id !== this.client.constants.mainGuildID ? " to the support server" : ""}.`);
  }
}

module.exports = Suggestion;
