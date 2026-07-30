import Event from '../structures/Event.js';
import type { TextChannel } from 'discord.js';

class EventError extends Event {
  async run(event: Event, err: any) {
    this.client.log.error(err);

    const channel = this.client.channels.cache.get('454776836929617921');
    if (!channel) return;

    const embed = this.client.embed()
      .setTitle('Event Error')
      .setDescription(`An Error occured in event: ${event.name}\n\`\`\`js\n${err.stack || err}\`\`\``);

    return (channel as TextChannel).send({ embeds: [embed] }).catch(() => null);
  }
}

export default EventError;
