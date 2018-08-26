const { Command, util: { codeBlock } } = require("klasa");

class Leaderboard extends Command {
  constructor(...args) {
    super(...args, {
      description: "View the top leaderboard",
      runIn: ["text"],
      usage: "[page:int]",
      aliases: ["lb", "top", "top10", "leader"]
    });
  }

  async run(msg, [page = 1]) {
    const list = msg.guild.members
      .filter((x) => x.settings.points > 0 && !x.user.bot)
      .array()
      .sort((a, b) => a.settings.points < b.settings.points ? 1 : -1);
    page -= 1;
    const total = Math.round(list.length / 10);
    if(total === 0) throw "Couldn't get top 10 members, maybe it's a dead place?";
    if(page + 1 > total) throw `There are only **${total || 1}** pages in the leaderboard`;
    const top = list.slice(page * 10, (page + 1) * 10);
    const leaderboard = [];
    const numPos = list.indexOf(msg.member);
    const pos = numPos === -1 ? "??" : (list.indexOf(msg.member) + 1).toString().padStart(2, "0");
    top.map((x, i) => {
      leaderboard.push(`${(page * 10 + (i + 1)).toString().padStart(2, "0")} ❯ ${x.user.tag}${" ".repeat(35 - x.user.tag.length)}::  ${x.settings.points.toLocaleString()}`);
    });
    leaderboard.push("-".repeat(50));
    leaderboard.push("Your Position:");
    leaderboard.push(`${pos} ❯ ${msg.author.tag}${" ".repeat(35 - msg.author.tag.length)}::  ${msg.member.settings.points.toLocaleString()}`);
    return msg.send(`**Top Leaderboard for __${msg.guild.name}__ (Page ${page + 1} out of ${total || 1})**${codeBlock("ascii", leaderboard.join("\n"))}`);
  }
}

module.exports = Leaderboard;
