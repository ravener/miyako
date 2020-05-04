const Event = require("../structures/Event.js");
const { MessageEmbed } = require("discord.js");

class GuildDelete extends Event {

  async run(guild) {
    if(!guild.available) return;
    
    // Delete guild settings.
    await this.client.settings.guilds.delete(guild.id).catch(() => null);
    
    const channel = this.client.channels.cache.get("454776806869041154");
    const embed = new MessageEmbed()
      .setTitle("Miyako left a server.")
      .setDescription(guild.name)
      .setThumbnail(guild.iconURL())
      .setColor(0xFF0000)
      .addField("Owner", guild.owner.user.tag)
      .addField("Member Count", guild.memberCount)
      .setFooter(guild.id);
    await channel.send({ embed }).catch(() => null);
    return this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.cache.size} Servers!`);
  }
}

module.exports = GuildDelete;
