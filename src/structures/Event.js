const Base = require("./Base.js");

class Event extends Base {
  constructor(client, store, file, options = {}) {
    super(client, store, file, options);

    // Wether this event should be registered as a raw event.
    this.raw = options.raw || false;
  }

  async _run(...args) {
    if (this.enabled) {
      try {
        await this.run(...args);
      } catch(err) {
        // Avoid recursion if error handler failed.
        if (this.name !== "eventError") this.client.emit("eventError", this, err);
      }
    }
  }

  async run() {}
}

module.exports = Event;
