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
    const { body } = res;
    const embed = new MessageEmbed()
      .setColor(0xFF0000)
      .setTitle(`Profile for: ${body.name}`)
      .setDescription(`#${body.tag}`)
      .addField("Brawlers Unlocked", `${body.brawlersUnlocked}`, true)
      .addField("Brawlers", `Name - Level\n${body.brawlers.map((b) => `• ${b.name} -> ${b.level}`).join("\n")}`, true)
      .addField("3v3 Victories", `${body.victories}`, true)
      .addField("Solo Showdown Victories", `${body.soloShowdownVictories}`, true)
      .addField("Duo Showdown Victories", `${body.duoShowdownVictories}`, true)
      .addField("Exp", body.expFmt, true)
      .addField("Exp Level", `${body.expLevel}`, true)
      .addField("Trophies", `Current: ${body.trophies}\nHighest: ${body.highestTrophies}`, true)
      .setThumbnail(body.avatarUrl)
      .addField("Best Time as Boss", body.bestTimeAsBoss, true)
      .addField("Best Robo Rumble Time", body.bestRoboRumbleTime, true);
    if(body.club) embed.addField("Club", `Name: ${body.club.name}\nTag: #${body.club.tag}`);
    return msg.send({ embed });
  }
}

module.exports = BSProfile;
