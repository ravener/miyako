const { Event } = require("klasa");
const { getAttachment } = require("../utils/utils.js");

class MessageDelete extends Event {
  
  async run(message) {
    if(message.channel.type === "text" && message.author.id !== this.client.user.id && (message.content ? message.content.length > 1 : true)) message.channel.snipe = message;

    const image = getAttachment(message);
    
    const match = /(?:https?)?(discord\.gg|discord\.me|discord\.io|discordapp\.com\/invite)\/(\S+)/i.test(message.content);
    
    // Because the monitor is supposed to emit the modlogs event on success deletion.
    if(match && message.guild.settings.automod.invites) return;
    this.client.emit("modlogs", message.guild, "messageDelete", { message, name: "messages", image });
    if (message.command && message.command.deletable) for (const msg of message.responses) msg.delete();
  }
}

module.exports = MessageDelete;
