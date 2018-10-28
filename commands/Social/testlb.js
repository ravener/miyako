/* eslint-disable */
const { Command, util: { codeBlock } } = require("klasa");
const { MessageEmbed } = require("discord.js");

class Leaderboard extends Command {
  constructor(...args) {
    super(...args, {
      description: "View the top leaderboard (beta version)",
      runIn: ["text"],
      usage: "[page:int]",
      permissionLevel: 2
      //aliases: ["lb", "top", "top10", "leader"]
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
    const { currency } = this.client.constants;
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setTitle("Leaderboard");
    const top = list.slice(page * 10, (page + 1) * 10);
    const leaderboard = [];
    const numPos = list.indexOf(msg.member);
    const pos = numPos === -1 ? "??" : (list.indexOf(msg.member) + 1).toString().padStart(2, "0");
    top.map((x, i) => {
      // leaderboard.push(`${(page * 10 + (i + 1)).toString().padStart(2, "0")} ❯ ${x.user.tag}${" ".repeat(35 - x.user.tag.length)}::  ${x.settings.points.toLocaleString()}`);
      leaderboard.push(`${(page * 10 + (i + 1)).toString().padStart(2, "0")} ❯ ${x.user.tag} => ${x.settings.points.toLocaleString()} ${currency}`);
    });
    embed.setDescription(leaderboard.join("\n"));
    embed.setFooter(`❯ Your Position: ${pos}`);
    return msg.send(`**Top Leaderboard for __${msg.guild.name}__ (Page ${page + 1} out of ${total || 1})**`, { embed });
  }
}

module.exports = Leaderboard;
