const Command = require("../../structures/Command.js");


class ServerInfo extends Command {
  constructor(...args) {
    super(...args, {
      guildOnly: true,
      aliases: ["guild", "si", "server"],
      description: "Get information on the current server."
    });
    
    this.verificationLevels = {
      "NONE": "None",
      "LOW": "Low",
      "MEDIUM": "Medium",
      "HIGH": "(╯°□°）╯︵ ┻━┻",
      "VERY_HIGH": "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻"
    };
    
    this.filterLevels = {
      "DISABLED": "Off",
      "MEMBERS_WITHOUT_ROLES": "No Role",
      "ALL_MEMBERS": "Everyone"
    };
  }

  async run(msg) {
    const days = Math.floor((new Date() - msg.guild.createdAt) / (1000 * 60 * 60 * 24));
    const bans = await msg.guild.fetchBans()
      .then((bans) => bans.size)
      .catch(() =>  "Couldn't fetch bans.");

    if(!msg.guild.owner) await msg.guild.members.fetch(msg.guild.ownerID).catch(() => null);

    const embed = this.client.embed()
      .setThumbnail(msg.guild.iconURL())
      .addField("❯ Name", msg.guild.name, true)
      .addField("❯ ID", msg.guild.id, true)
      .addField("❯ Creation Date", `${msg.guild.createdAt.toDateString()} (${days} days ago!)`, true)
      .addField("❯ Region", msg.guild.region, true)
      .addField("❯ Explicit Filter", this.filterLevels[msg.guild.explicitContentFilter], true)
      .addField("❯ Verification Level", this.verificationLevels[msg.guild.verificationLevel], true)
      .addField("❯ Owner", msg.guild.owner ? msg.guild.owner.user.tag : "Failed to get owner information.", true)
      .addField("❯ Members", `${msg.guild.memberCount}`, true)
      .addField("❯ Ban Count", bans, true);
    return msg.send({ embed });
  }
}

module.exports = ServerInfo;
