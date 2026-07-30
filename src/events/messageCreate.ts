import Event from '../structures/Event.js';
import type { Message } from 'discord.js';

class MessageCreate extends Event {
  async run(message: Message) {
    return this.client.commands.handler.handleMessage(message);
  }
}

export default MessageCreate;
