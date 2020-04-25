const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class Bug extends Command {
  constructor(...args) {
    super(...args, {
      description: "Found a bug? report with this.",
      cooldown: 60,
      usage: "bug <report>",
      aliases: ["reportbug", "bugreport"]
    });
  }
  
  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! What is the bug report?");
    const channel = this.client.channels.cache.get("460800229667504148");
    const embed = new MessageEmbed()
      .setTitle("Bug Report")
      .setDescription(args.join(" "))
      .setColor(0x9590EE)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 256 }))
      .setFooter(ctx.author.id);
    const m = await channel.send({ embed });
    return ctx.reply(`Your bug report has been sent${ctx.guild && ctx.guild.id === this.client.constants.mainGuildID ? "" : " to the support server."} You will hear back from my owner in DMs if there is anything wrong with your report. Have a nice day!`);
  }
}

module.exports = Bug;
