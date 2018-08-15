const { Event } = require("klasa");

class KlasaReady extends Event {
  
  run() {
    this.client.user.setActivity(`@Ladybug help | ${this.client.guilds.size} servers!`);
    for(const [, node] of this.client.lavalink.nodes) {
      if(!node.ws) node.connect();
    }
  }
}

module.exports = KlasaReady;
