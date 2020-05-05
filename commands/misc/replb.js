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
    const { rows } = await this.client.db.query("SELECT id, reputation FROM users ORDER BY reps DESC LIMIT 10");
    if(!rows.length) return ctx.reply("Looks like no one has any reputations.");

    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setTitle(`Top${rows.length === 1 ? "" : ` ${rows.length}`} respected user${rows.length > 1 ? "s" : ""} by reputations`)
      .setAuthor(ctx.author.tag, ctx.author.displayAvatarURL({ size: 64 }));
    
    for(let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const user = await this.client.users.fetch(row.id);
      embed.addField(`${(i + 1).padEnd(2, " ")} ❯ ${user.tag} - ${row.reputation}`);
    }

    return ctx.reply({ embed });
  }
}

module.exports = RepLB;
