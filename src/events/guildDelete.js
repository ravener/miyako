const Event = require("../structures/Event.js");

class GuildDelete extends Event {

  async run(guild) {
    // If the guild went unavailable don't do anything.
    if (!guild.available) return;
    
    // Delete guild settings.
    await this.client.settings.guilds.delete(guild.id).catch(() => null);
    
    const channel = this.client.channels.cache.get("454776806869041154");

    if (!channel) return;

    const embed = this.client.embed()
      .setTitle("Miyako left a server.")
      .setDescription(guild.name)
      .setThumbnail(guild.iconURL())
      .setColor(0xFF0000)
      .addField("Owner", guild.owner ? guild.owner.user.tag : "Failed to fetch owner information.")
      .addField("Member Count", guild.memberCount)
      .setFooter(guild.id);

    return channel.send({ embed });
  }
}

module.exports = GuildDelete;
