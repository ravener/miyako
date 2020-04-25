const Store = require("./Store.js");

class EventStore extends Store {
  constructor(client) {
    super(client, "events");
  }

  set(event) {
    const exists = super.get(event);
    if(exists) this.client.removeAllListeners(exists.name);
    super.set(event);
    this.client.on(event.name, event._run.bind(event));
    return event;
  }
}

module.exports = EventStore;
