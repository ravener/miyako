const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Tickle extends Command {
  constructor(...args) {
    super(...args, {
      description: "Tickle someone",
      usage: "tickle <@member>",
      guildOnly: true,
      cooldown: 3,
      cost: 5
    });
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member);

    if(member.id === ctx.author.id) return ctx.reply("Baka! You can't tickle yourself!");

    const { url } = await fetch("https://nekos.life/api/v2/img/tickle")
      .then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("Tickle")
      .setColor(0x9590EE)
      .setDescription(`**${member.displayName}**, you just got tickled by **${ctx.member.displayName}**`)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} | Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed });
  }
}

module.exports = Tickle;
