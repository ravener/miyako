const Store = require("./Store.js");

class EventStore extends Store {
  constructor(client) {
    super(client, "events");
  }

  set(event) {
    super.set(event);
    this.client.on(event.name, event._run.bind(event));
    return event;
  }

  clear() {
    // Remove the event handlers before clearing.
    for (const event of this.values()) this.delete(event.name);
  }

  delete(name) {
    const event = this.get(name);
    if (!event) return false;
    if (!event.raw) this.client.removeAllListeners(event.name);
    return super.delete(event.name);
  }
}

module.exports = EventStore;
