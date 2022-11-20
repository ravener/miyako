const Event = require("../structures/Event.js");

class MessageDelete extends Event {
  async run(message) {
    const ctx = this.client.commands.contexts.get(message.id);
    if (!ctx || !ctx.lastReply || !ctx.lastReply.deletable) return;

    return ctx.lastReply.delete().catch(() => null);
  }
}

module.exports = MessageDelete;
