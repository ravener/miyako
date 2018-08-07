const { Event } = require("klasa");

class MessageDelete extends Event {
  
  async run(message) {
    if(message.channel.type === "text") message.channel.snipe = message;
    let image = null;
    if(message.attachments.size) {
      const attach = message.attachments.filter((x) => /(jpg|jpeg|png|gif|webp)/ig.test(x.url));
      if(attach.size) image = attach.first().url;
    }
    if(!image && message.embeds.size) {
      const images = message.embeds.filter((em) => em.image && em.image.url);
      if(images.size) image = images.first().image.url;
    }
    
    const match = /(?:https?)?(discord\.gg|discord\.me|discord\.io|discordapp\.com\/invite)\/(\S+)/i.test(message.content);
    
    // Because the monitor is supposed to emit the modlogs event on success deletion.
    if(match && message.guild.configs.automod.invites) return;
    this.client.emit("modlogs", message.guild, "messageDelete", { message, name: "messages", image });
    if (message.command && message.command.deletable) for (const msg of message.responses) msg.delete();
  }
}

module.exports = MessageDelete;