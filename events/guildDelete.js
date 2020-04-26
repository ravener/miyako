const Event = require("../structures/Event.js");
const { MessageEmbed } = require("discord.js");

class GuildDelete extends Event {

  run(guild) {
    if(!guild.available) return;
    
    /* TODO
    if(!this.client.settings.preserveSettings) guild.settings.destroy().catch(() => null);
    guild.members.forEach((x) => x.settings.destroy().catch(() => null));
    */
    
    const channel = this.client.channels.cache.get("454776806869041154");
    const embed = new MessageEmbed()
      .setTitle("Miyako left a server.")
      .setDescription(guild.name)
      .setThumbnail(guild.iconURL())
      .setColor(0xff0000)
      .addField("Owner", guild.owner.user.tag)
      .addField("Member Count", guild.memberCount)
      .setFooter(guild.id);
    channel.send({ embed }).catch(() => null);
    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.cache.size} Servers!`);
  }
}

module.exports = GuildDelete;
