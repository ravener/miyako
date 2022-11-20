const Event = require("../structures/Event.js");

class MessageUpdate extends Event {
  async run(oldMsg, newMsg) {
    if (newMsg.content && newMsg.content !== oldMsg.content) {
      // Trigger the messageCreate event to handle commands.
      this.client.emit("messageCreate", newMsg);
    }
  }
}

module.exports = MessageUpdate;
