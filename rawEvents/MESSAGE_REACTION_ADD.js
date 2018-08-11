const RawEvent = require("../structures/RawEvent.js");
const { util: { codeBlock } } = require("klasa");
const { MessageEmbed, Util: { escapeMarkdown } } = require("discord.js");


class MessageReactionAdd extends RawEvent {
  
  async run(data) {
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
}

module.exports = MessageReactionAdd;