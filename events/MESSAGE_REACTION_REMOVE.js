const Event = require("../structures/Event.js");
const { MessageEmbed } = require("discord.js");

class RawMessageReactionRemove extends Event {
  constructor(...args) {
    super(...args, {
      raw: true
    });
  }

  async run(packet, shard) { // eslint-disable-line no-unused-vars
    if(packet.emoji.name === "⭐") return this.starboard(packet);
  }

  async starboard(packet) {
    // Grab the channel.
    const channel = this.client.channels.cache.get(packet.channel_id);
    if(!channel || channel.type !== "text") return;

    // Grab the guild.
    const guild = channel.guild;
    if(!guild.settings.starboard) return;

    // Fetch the user.
    const user = await this.client.users.fetch(packet.user_id)
      .catch(() => null);

    if(!user || user.bot) return;

    // Fetch the full message.
    const msg = await channel.messages.fetch(packet.message_id)
      .catch(() => null);
    
    if(!msg) return;

    // Cannot react/unreact to own message.
    if(msg.author.id === user.id) return;

    // Grab the starboard channel.
    const starboard = guild.channels.cache.get(guild.settings.starboard);
    if(!starboard) return;

    const messages = await starboard.messages.fetch({ limit: 50 })
      .catch(() => null);

    if(!messages) return;

    // Try to find an existing starboard message.
    const stars = messages.find((m) => m.author.id === this.client.user.id && m.embeds.length &&
      m.embeds[0].footer && m.embeds[0].footer.text && m.embeds[0].footer.text.startsWith("⭐") &&                                            m.embeds[0].footer.text.endsWith(msg.id));

    // Do nothing if it wasn't already starred.
    if(!stars) return;

    const star = /^⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);

    // If it went below the limit delete it.
    if(parseInt(star[1]) - 1 < guild.settings.starboardLimit) return stars.delete();

    const foundStar = stars.embeds[0];
    const embed = new MessageEmbed()
      .setColor(foundStar.color)
      .setTitle(foundStar.title)
      .setURL(msg.url)
      .setDescription(foundStar.description || "")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setTimestamp()
      .setFooter(`⭐ ${parseInt(star[1]) - 1} | ${msg.id}`)
      .setImage(this.client.utils.getImage(msg));
    
    return stars.edit({ embed });
  }
}

module.exports = RawMessageReactionRemove;
