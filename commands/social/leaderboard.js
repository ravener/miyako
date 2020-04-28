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

    // SQL injection risk, can't use $1 params here so we have to do this. However guild.id is always safe.
    const { rows } = await this.client.db.query(`SELECT * FROM members WHERE id LIKE '${ctx.guild.id}.%' ORDER BY points DESC`);

    const totalPages = Math.round(rows.length / 10);

    if(totalPages === 0) return ctx.reply("There is no leaderboard in the server, maybe its a dead place???");

    page -= 1;

    if(page > totalPages && !totalPages) return ctx.reply(`There are only **${totalPages || 1}** pages in the leaderboard.`);
    if(totalPages && page + 1 > totalPages) return ctx.reply(`There are only **${totalPages || 1}** pages in the leaderboard.`);

    const positions = rows.map((row) => row.id.split(".")[1]);
    const leaderboard = [];

    const top = rows.slice(page * 10, (page + 1) * 10);

    for(let i = 0; i < top.length; i++) {
      const u = top[i];
      const user = await this.client.users.fetch(u.id.split(".")[1]);
      leaderboard.push(`${(page * 10 + (i + 1)).toString().padStart(2, "0")} ❯ ${user.tag}${" ".repeat(25 - user.tag.length)}::  ¥${parseInt(u.points).toLocaleString()}`);
    }
    
    leaderboard.push("-------------------------------------------------------------");
    const pos = positions.indexOf(ctx.author.id).toString().padStart(2, "0");
    const posTxt = pos == -1 ? "??" : (positions.indexOf(ctx.author.id) + 1).toString().padStart(2, "0");
    leaderboard.push(`${posTxt} ❯ ${ctx.author.tag}${" ".repeat(25 - ctx.author.tag.length)}::  ¥${(await ctx.member.getBalance()).toLocaleString()}`);
    return ctx.reply(`**__${ctx.guild.name}__**'s Leaderboard (Page **${page + 1}** out of **${totalPages || 1}**)\n\`\`\`${leaderboard.join("\n")}\`\`\``);
  }
}

module.exports = Leaderboard;
