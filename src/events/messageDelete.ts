import Event from '../structures/Event.js';
import type { Message } from 'discord.js';

class MessageDelete extends Event {
  async run(message: Message) {
    if (message.lastReply && message.lastReply.deletable) {
      return message.lastReply.delete().catch(() => null);
    }
  }
}

export default MessageDelete;
