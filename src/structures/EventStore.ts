import Store from './Store.js';
import type { ClientEvents } from 'discord.js';
import type MiyakoClient from './MiyakoClient.js';
import type Event from './Event.js';

class EventStore extends Store {
  constructor(client: MiyakoClient) {
    super(client, 'events');
  }

  set(event: Event): Event {
    super.set(event);
    this.client.on(event.name as keyof ClientEvents, event._run.bind(event) as (...args: unknown[]) => void);
    return event;
  }

  clear() {
    // Remove the event handlers before clearing.
    for (const event of this.values()) this.delete(event.name);
  }

  delete(name: string): boolean {
    const event = this.get(name) as Event | undefined;
    if (!event) return false;
    if (!event.raw) this.client.removeAllListeners(event.name as keyof ClientEvents);
    return super.delete(event.name);
  }
}

export default EventStore;
