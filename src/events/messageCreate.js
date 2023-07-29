import Event from '../structures/Event.js';

class MessageCreate extends Event {
  async run(message) {
    return this.client.commands.handler.handleMessage(message);
  }
}

export default MessageCreate;
