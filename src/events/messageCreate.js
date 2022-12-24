const Event = require("../structures/Event.js");

class MessageCreate extends Event {
  async run(message) {
    return this.client.commands.handler.handleMessage(message);
  }
}

module.exports = MessageCreate;
