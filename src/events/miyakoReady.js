const Event = require("../structures/Event.js");

class MiyakoReady extends Event {
  async run() {
    // Setup presence.
    this.client.rollPresence();

    // Roll a random presence every 5 minutes.
    this.client.setInterval(() => this.client.rollPresence(), 300000);

    // Setup cache sweeper. (Unless we are in development mode)
    if (!this.client.dev) this.client.sweeper.setup();
  } 
}

module.exports = MiyakoReady;
