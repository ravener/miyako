const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

class Poke extends Command {
  constructor(...args) {
    super(...args, {
      description: "Poke someone",
      usage: "poke <@member>",
      guildOnly: true,
      cooldown: 3,
      cost: 5
    });
  }

  async run(ctx, [member]) {
    member = await this.verifyMember(ctx, member);

    if(member.id === ctx.author.id) return ctx.reply("Baka! You can't poke yourself!");

    const { url } = await fetch("https://nekos.life/api/v2/img/poke")
      .then((res) => res.json());

    const embed = new MessageEmbed()
      .setTitle("Poke")
      .setColor(0x9590EE)
      .setDescription(`**${member.displayName}**, you just got poked by **${ctx.member.displayName}**`)
      .setImage(url)
      .setFooter(`Requested by: ${ctx.author.tag} | Powered by nekos.life`, ctx.author.displayAvatarURL({ size: 32 }));

    return ctx.reply({ embed });
  }
}

module.exports = Poke;
