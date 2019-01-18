const { Event } = require("klasa");

class KlasaReady extends Event {
  
  run() {
    const { client } = this;
    client.user.setActivity(`@Ladybug help | ${this.client.guilds.size} servers!`);
    return client.utils.postStats()
      .catch(() => null);
  }
}

module.exports = KlasaReady;
