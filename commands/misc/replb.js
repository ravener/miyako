const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

class RepLB extends Command {
  constructor(...args) {
    super(...args, {
      description: "View top people with most reputations.",
      aliases: ["repleaderboard", "reputationleaderboard", "reputationlb"]
    });
  }

  async run(ctx) {
    const rows = await this.client.settings.users.find({
      where: { reputation: { gt: 0 } }, sort: { reputation: -1 }, limit: 10
    });

    if(!rows.length) return ctx.reply("Looks like no one has any reputations.");

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setTitle(`Top${rows.length === 1 ? "" : ` ${rows.length}`} respected user${rows.length > 1 ? "s" : ""} by reputations`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }))
      .setFooter(`Give reputation to users via ${ctx.guild.settings.prefix}rep @user to help them climb the leaderboard.`);

    const lb = [];
    
    for(let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const user = await this.client.users.fetch(row.id);
      lb.push(`${((i + 1).toString()).padEnd(2, " ")} ❯ ${user.tag} - ${row.reputation}`);
    }

    embed.setDescription(lb.join("\n"));

    return ctx.reply({ embed });
  }
}

module.exports = RepLB;
