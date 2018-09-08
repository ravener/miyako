const { Event } = require("klasa");

class MessageUpdate extends Event {
  
  async run(old, message) {
    if (old.content === message.content) return;
    if (this.client.ready) this.client.monitors.run(message);
    if (message.author.bot) return;
    this.client.emit("modlogs", message.guild, "messageUpdate", { old, message, name: "messages" });
  }
}

module.exports = MessageUpdate;
