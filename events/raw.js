const Event = require("../structures/Event.js");

class Raw extends Event {
  run(packet, shard) {
    const event = this.store.raw.get(packet.t);
    if(!event) return;

    return event._run(packet.d, shard);
  }
}

module.exports = Raw;
