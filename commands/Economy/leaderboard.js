const { Command, util: { codeBlock } } = require("klasa");

class Leaderboard extends Command {
  constructor(...args) {
    super(...args, {
      description: "View the top leaderboard",
      runIn: ["text"],
      aliases: ["lb", "top", "top10", "leader"]
    });
  }

  async run(msg) {
    const top = msg.guild.members
      .filter((x) => x.settings.points > 0 && !x.user.bot)
      .array()
      .sort((a, b) => a.settings.points < b.settings.points)
      .slice(0, 10);
    if(!top.length) throw "Couldn't get top 10 members, maybe it's a dead place?";
    const leaderboard = [];
    const pos = top.indexOf(msg.member).toString().padStart(2, "0");
    top.map((x, i) => {
      leaderboard.push(`${i.toString().padStart(2, "0")} ❯ ${x.user.tag}${" ".repeat(30 - x.user.tag.length)}::  ${x.settings.points.toLocaleString()}`);
    });
    leaderboard.push("-".repeat(30));
    leaderboard.push("Your Position:");
    leaderboard.push(`${pos} ❯ ${msg.author.tag}`);
    return msg.send(`**Top 10 Leaderboard**${codeBlock("ascii", leaderboard.join("\n"))}`);
  }
}

module.exports = Leaderboard;
