const Event = require("../structures/Event.js");
const { MessageEmbed } = require("discord.js");

class GuildCreate extends Event {
  async run(guild) {
    if(!guild.available) return;

    const channel = this.client.channels.cache.get("454776806869041154");

    if(!guild.owner && guild.ownerID) await guild.members.fetch(guild.ownerID);

    const embed = new MessageEmbed()
      .setTitle("Miyako joined a new server!")
      .setDescription(guild.name)
      .setColor(0x9590EE)
      .setThumbnail(guild.iconURL())
      .addField("Owner", guild.owner.user.tag)
      .addField("Member Count", guild.memberCount)
      .setFooter(guild.id);

    /* if (this.client.settings.guildBlacklist.includes(guild.id)) { TODO
      embed.setFooter(guild.id + " | Blacklisted");
      guild.leave();
      this.client.emit("warn", `Blacklisted guild detected: ${guild.name} [${guild.id}]`);
    }*/
    
    return channel.send({ embed });

    /* TODO
    const join = guild.channels.find((c) => c.type === "text" && c.postable);
    if(!join) return;
    return join.send([
      "Hey there, thanks for inviting me in to this wonderful server",
      `Start by typing \`${guild.settings.prefix}help\` to get a list of commands`,
      `If you found any bugs please report them using \`${guild.settings.prefix}bug\``,
      `If you have any ideas that you would like to see in this bot feel free to suggest them using \`${guild.settings.prefix}suggest\``,
      "",
      `Note: levelup messages are enabled by default if you found them annoying feel free to disable it using \`${guild.settings.prefix}levelup disable\``,
      "",
      `If you still have any questions ask them in our server, use \`${guild.settings.prefix}support\``,
      "",
      "Have a great day!"
    ].join("\n")).catch(() => null);
    */
  }
}

module.exports = GuildCreate;
