const RawEvent = require("../structures/RawEvent.js");
const { util: { codeBlock } } = require("klasa");
const { MessageEmbed, Util: { escapeMarkdown } } = require("discord.js");
const { getAttachment } = require("../utils/utils.js");


class MessageReactionAdd extends RawEvent {
  
  async run(data) {
    if(data.emoji.name === "⭐") return this.starboard(data);
    if(!data.emoji.id) return;
    if(data.user_id === this.client.user.id) return;
    const channel = this.client.channels.get(data.channel_id);
    if(!channel || channel.id !== "460800229667504148") return;
    if(data.emoji.id !== "466669201025925120") return;
    const msg = await channel.messages.fetch(data.message_id).catch(() => null);
    if(!msg || !msg.embeds.length) return;
    const user = this.client.users.get(msg.embeds[0].footer.text);
    if(!user) return;
    const embed = new MessageEmbed()
      .setAuthor(this.client.owner.tag, this.client.owner.displayAvatarURL())
      .setTitle("Invalid Report")
      .setColor(0xff0000)
      .setDescription(`Your bug report ${codeBlock("", escapeMarkdown(msg.embeds[0].description, true))}has been marked invalid, please be more specific next time.`);
    await user.send({ embed }).catch(() => null);
    await msg.delete();
  }

  async starboard(data) {
    const channel = this.client.channels.get(data.channel_id);
    if(!channel || channel.type !== "text") return;
    const guild = channel.guild;
    if(!guild.settings.starboard.enabled) return;
    const starboard = guild.channels.get(guild.settings.starboard.channel);
    if(!starboard || !starboard.postable || !starboard.embedable) return;
    const user = this.client.users.get(data.user_id);
    if(!user || user.bot) return;
    const msg = await channel.messages.fetch(data.message_id).catch(() => null);
    if(!msg) return;
    if(msg.author.id === user.id) return;
    const fetch = await starboard.messages.fetch({ limit: 100 }).catch(() => null);
    if(!fetch) return;
    const stars = fetch.find(m => m.embeds.length && m.embeds[0].footer && m.embeds[0].footer.text && m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(msg.id));
    if(stars) {
      // Regex to check how many stars the embed has.
      const star = /^⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
      // A variable that allows us to use the color of the pre-existing embed.
      const foundStar = stars.embeds[0];
      const embed = new MessageEmbed()
        .setColor(foundStar.color)
        .setTitle(foundStar.title)
        .setURL(msg.url)
        .setDescription(foundStar.description || "")
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(`⭐ ${parseInt(star[1])+1} | ${msg.id}`)
        .setImage(getAttachment(msg));
      return stars.edit({ embed }); 
    }

    if(msg.reactions.get("⭐").count < msg.guild.settings.starboard.limit) return;
    const content = msg.content ? msg.content : (msg.embeds.length && msg.embeds[0].description) ? msg.embeds[0].description : "";
    const embed = new MessageEmbed()
      .setColor(15844367)
      .setTitle("Click Here to jump to the message")
      .setURL(msg.url)
      .setDescription(content || "")
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setTimestamp()
      .setFooter(`⭐ ${msg.guild.settings.starboard.limit} | ${msg.id}`)
      .setImage(getAttachment(msg));
    return starboard.send({ embed }).catch(() => null);
  }
}

module.exports = MessageReactionAdd;
