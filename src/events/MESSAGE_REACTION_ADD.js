const Event = require("../structures/Event.js");
const { MessageEmbed } = require("discord.js");

class RawMessageReactionAdd extends Event {
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

    // Grab the starboard channel.
    const starboard = guild.channels.cache.get(guild.settings.starboard);
    if(!starboard || !starboard.permissionsFor(guild.me).has(["SEND_MESSAGES", "EMBED_LINKS"])) return;
    
    // Grab the author.
    const user = await this.client.users.fetch(packet.user_id);
    if(!user || user.bot) return;

    // Fetch the full message.
    const msg = await channel.messages.fetch(packet.message_id).catch(() => null);
    if(!msg) return;

    // Users cannot star their own message.
    if(msg.author.id === user.id) return;

    // Fetch last 50 messages from the starboard channel.
    const messages = await starboard.messages.fetch({ limit: 50 })
      .catch(() => null);

    if(!messages) return;

    // Try to find an existing starboard message.
    const stars = messages.find((m) => m.author.id === this.client.user.id && m.embeds.length &&
      m.embeds[0].footer && m.embeds[0].footer.text && m.embeds[0].footer.text.startsWith("⭐") &&
      m.embeds[0].footer.text.endsWith(msg.id));

    // If we found the existing message just update the star count.
    if(stars) {
      // Regex to check how many stars the embed has.
      const star = /^⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      // A variable that allows us to use the color of the pre-existing embed.
      const foundStar = stars.embeds[0];

      // Construct our new embed with the updated star count.
      const embed = new MessageEmbed()
        .setColor(foundStar.color)
        .setTitle(foundStar.title)
        .setURL(msg.url)
        .setDescription(foundStar.description || "")
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])+1} | ${msg.id}`)
        .setImage(this.client.utils.getImage(msg));

      // Edit the message 
      return stars.edit({ embed });
    }

    // Otherwise this must be a new message so send a new starboard entry for it.

    // If the star limit is not satisfied do not post it.
    if(msg.reactions.cache.get("⭐").count < guild.settings.starboardLimit) return;

    // Grab the content.
    const content = msg.content ? msg.content : (msg.embeds.length && msg.embeds[0].description) ? msg.embeds[0].description : "";

    // Construct our new embed.
    const embed = new MessageEmbed()
      .setColor(15844367)
      .setTitle("Click Here to jump to the message")
      .setURL(msg.url)
      .setDescription(content)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ size: 64 }))
      .setTimestamp()
      .setFooter(`⭐ ${guild.settings.starboardLimit} | ${msg.id}`)
      .setImage(this.client.utils.getImage(msg));

    // Send the embed.
    return starboard.send({ embed })
      .catch(() => null);
  }
}

module.exports = RawMessageReactionAdd;
