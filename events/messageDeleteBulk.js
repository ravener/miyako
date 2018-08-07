const { Event } = require("klasa");

class MessageDeleteBulk extends Event {
  
  run(messages) {
    this.client.emit("modlogs", messages.first().guild, "purge", { name: "messages", messages });
    for (const message of messages) if (message.command && message.command.deletable) for (const msg of message.responses) msg.delete();
  }
}

module.exports = MessageDeleteBulk;