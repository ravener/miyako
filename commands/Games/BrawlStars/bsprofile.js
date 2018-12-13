const { Command } = require("klasa");
const { Client } = require("brawlstars");
const { MessageEmbed } = require("discord.js");

class BSProfile extends Command {
  constructor(...args) {
    super(...args, {
      description: "Get your brawlstars stats!",
      usage: "[tag:sctag|user:username]"
    });
    this.bs = new Client({ token: this.client.config.brawlstars });
  }

  async run(msg, [tag]) {
    if(!tag && !msg.author.settings.bstag) throw "You must provide a valid tag.";
    const t = tag.tag ? tag.settings.bstag : tag || msg.author.settings.bstag;
    if(!t) throw `Couldn't find any saved tags, save your tag with \`${msg.guild ? msg.guild.settings.prefix : "lb."}bssave <tag>\``;
    const res = await this.bs.getPlayer(t)
      .catch(() => null);
    if(!res) throw "Failed to fetch profile, are you sure that tag exists?";
    const embed = new MessageEmbed()
      .setColor(0xFF0000)
      .setTitle(`Profile for: ${res.name}`)
      .setDescription(`#${res.tag}`)
      .addField("Brawlers Unlocked", `${res.brawlersUnlocked}`, true)
      .addField("Brawlers", `Name - Level\n${res.brawlers.map((b) => `• ${b.name} -> ${b.level}`).join("\n")}`, true)
      .addField("3v3 Victories", `${res.victories}`, true)
      .addField("Solo Showdown Victories", `${res.soloShowdownVictories}`, true)
      .addField("Duo Showdown Victories", `${res.duoShowdownVictories}`, true)
      .addField("Exp", res.expFmt, true)
      .addField("Exp Level", `${res.expLevel}`, true)
      .addField("Trophies", `Current: ${res.trophies}\nHighest: ${res.highestTrophies}`, true)
      .setThumbnail(res.avatarUrl)
      .addField("Best Time as Boss", res.bestTimeAsBoss, true)
      .addField("Best Robo Rumble Time", res.bestRoboRumbleTime, true);
    if(res.club)
      embed.addField("Club", `Name: ${res.club.name}\nTag: #${res.club.tag}`);
    else
      embed.addField("Club", "N/A");
    return msg.send({ embed });
  }
}

module.exports = BSProfile;
