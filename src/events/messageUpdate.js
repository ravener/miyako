import Event from '../structures/Event.js';

class MessageUpdate extends Event {
  async run(oldMsg, newMsg) {
    if (newMsg.content && newMsg.content !== oldMsg.content) {
      return this.client.commands.handler.handleMessage(newMsg);
    }
  }
}

export default MessageUpdate;
