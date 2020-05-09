const Store = require("./Store.js");
const { Collection } = require("discord.js");

class EventStore extends Store {
  constructor(client) {
    super(client, "events");

    // Raw Events are stored in this collection.
    this.raw = new Collection();
  }

  set(event) {
    // Store raw events seperately.
    // See events/raw.js for triggering this.
    if(event.raw) {
      this.raw.set(event.name, event);
    } else {
      super.set(event);
      this.client.on(event.name, event._run.bind(event));
    }

    return event;
  }

  delete(name) {
    const event = this.get(name);
    if(!event) return false;
    if(!event.raw) this.client.removeAllListeners(event.name);
    return super.delete(event.name);
  }
}

module.exports = EventStore;
