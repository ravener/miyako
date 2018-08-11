const { Event } = require("klasa");

class MessageDelete extends Event {
  
  async run(message) {
    if(message.channel.type === "text") message.channel.snipe = message;
    let image = null;
    if(message.attachments.size) {
      const attach = message.attachments.filter((x) => x.width && x.height && x.url);
      if(attach.size) image = attach.first().url;
    }
    if(!image && message.embeds.length) {
      const images = message.embeds.filter((em) => em.image && em.image.url);
      if(images.size) image = images[0].image.url;
    }
    
    const match = /(?:https?)?(discord\.gg|discord\.me|discord\.io|discordapp\.com\/invite)\/(\S+)/i.test(message.content);
    
    // Because the monitor is supposed to emit the modlogs event on success deletion.
    if(match && message.guild.settings.automod.invites) return;
    this.client.emit("modlogs", message.guild, "messageDelete", { message, name: "messages", image });
    if (message.command && message.command.deletable) for (const msg of message.responses) msg.delete();
  }
}

module.exports = MessageDelete;