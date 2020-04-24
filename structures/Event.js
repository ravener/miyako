
class Event {
  constructor(client, file, options = {}) {
    this.name = options.name || file.name;
    this.client = client;
    this.file = file;
    this.enabled = typeof options.enabled !== "undefined" ? options.enabled : true;
    this.store = this.client.events;
  }

  async _run(...args) {
    if(this.enabled) {
      try {
        await this.run(...args);
      } catch(err) {
        // Avoid recursion if error handler failed.
        if(this.name !== "eventError") this.client.emit("eventError", this, err);
      }
    }
  }

  async run(...args) {}

  reload() {
    return this.store.load(this.file.path);
  }

  enable() {
    this.enabled = true;
    return this;
  }

  disable() {
    this.enabled = false;
    return this;
  }
}

module.exports = Event;
