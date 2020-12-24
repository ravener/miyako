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

  async run(msg, [page]) {
    page = this.verifyInt(page, 1);

    const rows = await this.client.settings.members.find({ id: { $regex: `^${msg.guild.id}`  } },
      { sort: { points: -1 } }).toArray();

    if(rows.length === 0) return msg.send("There is no leaderboard in this server, maybe its a dead place???");

    const totalPages = Math.max(Math.round(rows.length / 10), 1);

    page -= 1;

    if(page > totalPages && !totalPages) return msg.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);
    if(totalPages && page + 1 > totalPages) return msg.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);

    const positions = rows.map((row) => row.id.split(".")[1]);
    const leaderboard = [];

    const top = rows.slice(page * 10, (page + 1) * 10);

    for(let i = 0; i < top.length; i++) {
      const u = top[i];
      const user = await this.client.users.fetch(u.id.split(".")[1]);
      leaderboard.push(`- [${(page * 10 + (i + 1)).toString().padStart(2, "0")}] ❯ ${user.tag}\n    => ¥${parseInt(u.points).toLocaleString()}`);
    }
    
    const pos = positions.indexOf(msg.author.id).toString().padStart(2, "0");
    const posTxt = pos == -1 ? "??" : (positions.indexOf(msg.author.id) + 1).toString().padStart(2, "0");
    leaderboard.push(`\n+ [${posTxt}] ❯ ${msg.author.tag}\n    => ¥${parseInt(msg.member.settings.points).toLocaleString()}`);
    return msg.send(`**__${msg.guild.name}__**'s Leaderboard (Page **${page + 1}** out of **${totalPages || 1}**)\n\`\`\`\n${leaderboard.join("\n")}\`\`\``);
  }
}

module.exports = Leaderboard;
