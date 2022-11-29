const Event = require("../structures/Event.js");

class GuildDelete extends Event {

  async run(guild) {
    // If the guild went unavailable don't do anything.
    if (!guild.available) return;
    
    const channel = this.client.channels.cache.get("454776806869041154");
    if (!channel) return;

    const owner = await this.client.users.fetch(guild.ownerId)
      .catch(() => null);

    const embed = this.client.embed()
      .setTitle("Miyako left a server.")
      .setDescription(guild.name)
      .setThumbnail(guild.iconURL())
      .setColor(0xFF0000)
      .addFields({
        name: "Owner",
        value: owner?.tag ?? "Failed to fetch owner information.",
        inline: true
      })
      .addFields({
        name: "Member Count",
        value: guild.memberCount.toString(),
        inline: true
      })
      .setFooter({ text: guild.id });

    return channel.send({ embeds: [embed] }).catch(() => null);
  }
}

module.exports = GuildDelete;
