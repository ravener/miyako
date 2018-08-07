const { Store } = require("klasa");
const RawEvent = require("../structures/RawEvent.js");

class RawEventStore extends Store {
  constructor(client) {
    super(client, "rawEvents", RawEvent);
  }
  
  async run(data) {
    const event = this.get(data.t);
    if(!event || !event.enabled) return;
    try {
      await event.run(data.d);
    } catch(err) {
      this.client.emit("wtf", err);
    }
  }
}

module.exports = RawEventStore;