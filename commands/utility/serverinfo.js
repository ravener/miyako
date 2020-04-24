const Command = require("../../structures/Command.js");
const { MessageEmbed } = require("discord.js");

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

  async run(ctx) {
    const days = Math.floor((new Date() - ctx.guild.createdAt) / (1000 * 60 * 60 * 24));
    const bans = await ctx.guild.fetchBans()
      .then((bans) => bans.size)
      .catch(() =>  "Couldn't fetch bans.");
    const embed = new MessageEmbed()
      .setColor(0x9590EE)
      .setThumbnail(ctx.guild.iconURL())
      .addField("❯ Name", ctx.guild.name, true)
      .addField("❯ ID", ctx.guild.id, true)
      .addField("❯ Creation Date", `${ctx.guild.createdAt.toDateString()} (${days} days ago!)`, true)
      .addField("❯ Region", ctx.guild.region, true)
      .addField("❯ Explicit Filter", this.filterLevels[ctx.guild.explicitContentFilter], true)
      .addField("❯ Verification Level", this.verificationLevels[ctx.guild.verificationLevel], true)
      .addField("❯ Owner", ctx.guild.owner ? ctx.guild.owner.user.tag : "Failed to get owner information.", true)
      .addField("❯ Members", `${ctx.guild.memberCount}`, true)
      .addField("❯ Ban Count", bans, true);
    return ctx.reply({ embed });
  }
}

module.exports = ServerInfo;
