const Command = require("../../structures/Command.js");
const { PermissionFlagsBits } = require("discord.js");

class TopInvites extends Command {
  constructor(...args) {
    super(...args, {
      guildOnly: true,
      aliases: ["ti"],
      botPermissions: [PermissionFlagsBits.ManageGuild],
      description: "Shows the top invites in a server."
    });
  }

  async run(ctx) {
    const invites = await ctx.guild.invites.fetch();
    const topTen = invites
      .filter(invite => invite.uses > 0)
      .sort((a, b) => b.uses - a.uses)
      .first(10);

    if (topTen.length === 0) {
      return ctx.reply("There are no invites, or none of them have been used!");
    }

    const embed = this.client.embed()
      .setTitle(`Top Invites in ${ctx.guild.name}`)
      .setAuthor({
        name: ctx.guild.name,
        iconURL: ctx.guild.iconURL()
      })
      .setDescription(topTen.map((inv) => `• **${inv.inviter.username}**'s invite **${inv.code}** has **${inv.uses.toLocaleString()}** uses.`).join("\n"));

    return ctx.reply({ embeds: [embed] });
  }
}

module.exports = TopInvites;
