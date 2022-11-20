const Event = require("../structures/Event.js");

class MessageDelete extends Event {
  async run(message) {
    if (message.lastReply && message.lastReply.deletable) {
      return message.lastReply.delete().catch(() => null);
    }
  }
}

module.exports = MessageDelete;
