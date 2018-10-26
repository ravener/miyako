const RawEvent = require("../structures/RawEvent.js");
const { MessageEmbed } = require("discord.js");
const { getAttachment } = require("../utils/utils.js");

class MessageReactionRemove extends RawEvent {

  async run(d) {
    if (d.emoji.name !== "⭐") return;
    const channel = this.client.channels.get(d.channel_id);
    if(!channel.guild.settings.starboard.enabled) return;
    const user = this.client.users.get(d.user_id);
    if(!user || user.bot) return;
    const msg = await channel.messages.fetch(d.message_id).catch(() => null);
    if(!msg) return;
    if(msg.author.id === user.id) return;
    const starboard  = msg.guild.channels.get(msg.guild.settings.starboard.channel);
    if (!starboard) return;
    const fetchedMessages = await starboard.messages.fetch({ limit: 100 }).catch(() => null);
    if(!fetchedMessages) return;
    const stars = fetchedMessages.find(m => m.embeds.length && m.embeds[0].footer && m.embeds[0].footer.text && m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(msg.id));
    if (stars) {
      const star = /^⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      const foundStar = stars.embeds[0];
      const embed = new MessageEmbed()
        .setColor(foundStar.color)
        .setTitle(foundStar.title)
        .setURL(msg.url)
        .setDescription(foundStar.description || "")
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])-1} | ${msg.id}`)
        .setImage(getAttachment(msg));
      await stars.edit({ embed });
      if(parseInt(star[1]) - 1 < msg.guild.settings.starboard.limit) return stars.delete({ timeout: 1000 });
    }
  }
}

module.exports = MessageReactionRemove;
