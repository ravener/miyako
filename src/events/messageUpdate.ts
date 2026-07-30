import Event from '../structures/Event.js';
import type { Message } from 'discord.js';

class MessageUpdate extends Event {
  async run(oldMsg: Message, newMsg: Message) {
    if (newMsg.content && newMsg.content !== oldMsg.content) {
      return this.client.commands.handler.handleMessage(newMsg);
    }
  }
}

export default MessageUpdate;
