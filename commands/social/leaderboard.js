const Command = require("../../structures/Command.js");

class Leaderboard extends Command {
  constructor(...args) {
    super(...args, {
      description: "View the server leaderboard.",
      usage: "leaderboard [page]",
      guildOnly: true,
      aliases: ["lb", "top"]
    });
  }

  async run(ctx, [page]) {
    page = this.verifyInt(page, 1);

    const rows = await this.client.settings.members.find({
      where: { id: { like: `${ctx.guild.id}.%` } }, sort: { points: -1 }
    });

    if(rows.length === 0) return ctx.reply("There is no leaderboard in this server, maybe its a dead place???")

    const totalPages = Math.max(Math.round(rows.length / 10), 1);

    page -= 1;

    if(page > totalPages && !totalPages) return ctx.reply(`There are only **${totalPages || 1}** pages in the leaderboard.`);
    if(totalPages && page + 1 > totalPages) return ctx.reply(`There are only **${totalPages || 1}** pages in the leaderboard.`);

    const positions = rows.map((row) => row.id.split(".")[1]);
    const leaderboard = [];

    const top = rows.slice(page * 10, (page + 1) * 10);

    for(let i = 0; i < top.length; i++) {
      const u = top[i];
      const user = await this.client.users.fetch(u.id.split(".")[1]);
      leaderboard.push(`- [${(page * 10 + (i + 1)).toString().padStart(2, "0")}] ❯ ${user.tag}\n    => ¥${parseInt(u.points).toLocaleString()}`);
    }
    
    const pos = positions.indexOf(ctx.author.id).toString().padStart(2, "0");
    const posTxt = pos == -1 ? "??" : (positions.indexOf(ctx.author.id) + 1).toString().padStart(2, "0");
    leaderboard.push(`\n+ [${posTxt}] ❯ ${ctx.author.tag}\n    => ¥${parseInt(ctx.member.settings.points).toLocaleString()}`);
    return ctx.reply(`**__${ctx.guild.name}__**'s Leaderboard (Page **${page + 1}** out of **${totalPages || 1}**)\n\`\`\`${leaderboard.join("\n")}\`\`\``);
  }
}

module.exports = Leaderboard;
