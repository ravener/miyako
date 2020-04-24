const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class TopInvites extends Command {
  constructor(...args) {
    super(...args, {
      guildOnly: true,
      aliases: ["ti"],
      botPermissions: ["MANAGE_GUILD"],
      description: "Shows the top invites in a server."
    });
  }

  async run(ctx) {
    const invites = await ctx.guild.fetchInvites();
    const topTen = invites.filter((inv) => inv.uses > 0).sort((a, b) => b.uses - a.uses).first(10);

    if(topTen.length === 0) return ctx.reply("There are no invites, or none of them have been used!");

    return ctx.reply(new MessageEmbed()
      .setTitle(`Top Invites in ${ctx.guild.name}`)
      .setColor(0x9590EE)
      .setAuthor(ctx.guild.name, ctx.guild.iconURL())
      .setDescription(topTen.map((inv) => `• **${inv.inviter.username}**'s invite **${inv.code}** has **${inv.uses.toLocaleString()}** uses.`).join("\n")));
  }
}

module.exports = TopInvites;
