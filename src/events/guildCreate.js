const Event = require("../structures/Event.js");

class GuildCreate extends Event {
  async run(guild) {
    if (!guild.available) return;

    const channel = this.client.channels.cache.get("454776806869041154");
    if (!channel) return;
    if (!guild.owner && guild.ownerID) await guild.members.fetch(guild.ownerID);

    const embed = this.client.embed()
      .setTitle("Miyako joined a new server!")
      .setDescription(guild.name)
      .setThumbnail(guild.iconURL())
      .addFields({
        name: "Owner",
        value: guild.owner.user.tag,
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

module.exports = GuildCreate;
