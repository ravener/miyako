const { Event } = require("klasa");

class Raw extends Event {
  
  async run(d) {
    await this.client.rawEvents.run(d);
  }
}

module.exports = Raw;