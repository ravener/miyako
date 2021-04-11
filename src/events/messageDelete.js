const Event = require("../structures/Event.js");

class MessageDelete extends Event {

  async run(msg) {
    if (msg.lastResponse && msg.lastResponse.deletable) await msg.lastResponse.delete();
  }
}

module.exports = MessageDelete;
