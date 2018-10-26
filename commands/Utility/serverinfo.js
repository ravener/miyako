const { Command, Timestamp } = require("klasa");
const { MessageEmbed } = require("discord.js");

class ServerInfo extends Command {
  constructor(...args) {
    super(...args, {
      runIn: ["text"],
      aliases: ["guild", "si", "server"],
      description: "Get information on the current server."
    });
    
    this.verificationLevels = [
      "None",
      "Low",
      "Medium",
      "(╯°□°）╯︵ ┻━┻",
      "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻"
    ];
    
    this.filterLevels = [
      "Off",
      "No Role",
      "Everyone"
    ];
    this.timestamp = new Timestamp("d MMMM YYYY");
  }

  async run(msg) {
    const days = Math.floor((new Date() - msg.guild.createdAt) / (1000 * 60 * 60 * 24));
    const bans = await msg.guild.fetchBans()
      .then((bans) => bans.size)
      .catch(() =>  "Couldn't fetch bans.");
    if(msg.guild.large) await msg.guild.members.fetch().catch(() => null);
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setThumbnail(msg.guild.iconURL())
      .addField("❯ Name", msg.guild.name, true)
      .addField("❯ ID", msg.guild.id, true)
      .addField("❯ Creation Date", `${this.timestamp.display(msg.guild.createdAt)} (${days} days ago!)`, true)
      .addField("❯ Region", msg.guild.region, true)
      .addField("❯ Explicit Filter", this.filterLevels[msg.guild.explicitContentFilter], true)
      .addField("❯ Verification Level", this.verificationLevels[msg.guild.verificationLevel], true)
      .addField("❯ Owner", msg.guild.owner ? msg.guild.owner.user.tag : "None", true)
      .addField("❯ Members", `${msg.guild.memberCount} [${msg.guild.members.filter((x) => !x.user.bot).size} Users | ${msg.guild.members.filter((x) => x.user.bot).size} Bots]`, true)
      .addField("❯ Ban Count", bans, true);
    return msg.send({ embed });      
  }
}

module.exports = ServerInfo;
