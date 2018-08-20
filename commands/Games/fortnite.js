const { Command } = require("klasa");
const { MessageEmbed } = require("discord.js");
const superagent = require("superagent");

class Fortnite extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get your fortnite stats.",
      usage: "<platform:platform> <username:string> [...]",
      usageDelim: " ",
      aliases: ["fn", "fnprofile"]
    });
    
    this.createCustomResolver("platform", (arg) => {
      const platform = {
        xbl: "xbl",
        psn: "psn",
        pc: "pc",
        xbox: "xbl",
        ps4: "psn",
        playstation: "psn",
        computer: "pc" 
      }[arg.toLowerCase()];
      if(!platform) throw "Invalid platform given, expected one of `xbl, psn, pc`";
      return platform;
    });
  }
  
  async run(msg, [platform, ...username]) {
    const resp = await superagent.get(`https://api.fortnitetracker.com/v1/profile/${platform}/${encodeURIComponent(username.join(" "))}`)
      .set("TRN-Api-Key", this.client.config.fortnite)
      .then((r) => r.body);
    if(resp.error === "Player Not Found") throw "Couldn't find that player.";
    const embed = new MessageEmbed()
      .setTitle(resp.epicUserHandle)
      .setDescription(`Profile for ${resp.epicUserHandle} on {resp.platformNameLong}`)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setThumbnail("https://cdn.discordapp.com/attachments/460894620545449986/461579014394609665/IMG_20180627_200804.png")
      .setColor(0xff0000);
    try {
      embed.addField("Solos", `**Wins:** ${resp.stats.p2.top1.value}\n**Top 25:** ${resp.stats.p2.top25.displayValue}\n**Top 10:** ${resp.stats.p2.top10.displayValue}\n**KD:** ${resp.stats.p2.kd.displayValue}\n**Win Ratio:** ${resp.stats.p2.winRatio.displayValue}%\n**Kills:** ${resp.stats.p2.kills.displayValue}\n**Matches Played:** ${resp.stats.p2.matches.displayValue}\n**Kills Per Match:** ${resp.stats.p2.kpg.displayValue}`);
    } catch(_) {
      embed.addField("Solos", "**No Solos Played Yet**");
    }
    try {
      embed.addField("Duos", `**Wins:** ${resp.stats.p10.top1.value}\n**Top 5:** ${resp.stats.p10.top5.displayValue}\n**Top 12:** ${resp.stats.p10.top12.displayValue}\n**KD:** ${resp.stats.p10.kd.displayValue}\n**Win Ratio:** ${resp.stats.p10.winRatio.displayValue}%\n**Kills:** ${resp.stats.p10.kills.displayValue}\n**Matches Played:** ${resp.stats.p10.matches.displayValue}\n**Kills Per Match:** ${resp.stats.p10.kpg.displayValue}`);
    } catch(_) {
      embed.addField("Duos", "**No Duos Played Yet**");
    }
    try {
      embed.addField("Squads", `**Wins:** ${resp.stats.p9.top1.value}\n**Top 3:** ${resp.stats.p9.top3.displayValue}\n**Top 6:** ${resp.stats.p9.top6.displayValue}\n**KD:** ${resp.stats.p9.kd.displayValue}\n**Win Ratio:** ${resp.stats.p9.winRatio.displayValue}%\n**Kills:** ${resp.stats.p9.kills.displayValue}\n**Matches Played:** ${resp.stats.p9.matches.displayValue}\n**Kills Per Match:** ${resp.stats.p9.kpg.displayValue}`);
    } catch(_) {
      embed.addField("Squads", "**No Squads Played Yet**");
    }
    try {
      embed.addField("Life Time Stats", `**Score**: ${resp.lifeTimeStats[6].value}\n**Matches Played:** ${resp.lifeTimeStats[7].value}\n**Wins:** ${resp.lifeTimeStats[8].value}\n**Win Ratio:** ${resp.lifeTimeStats[9].value}\n**Kills:** ${resp.lifeTimeStats[10].value}\n**KD:** ${resp.lifeTimeStats[11].value}`);
    } catch(_) {
      embed.addField("Life Time Stats", "**Failed to get life time stats**");
    }
    return msg.send({ embed });
  } 
}

module.exports = Fortnite;
