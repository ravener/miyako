const Event = require("../structures/Event.js");

class MiyakoReady extends Event {
  async run() {
    this.client.user.setActivity(`@${this.client.user.username} help | ${this.client.guilds.cache.size} Server${this.client.guilds.cache.size > 1 ? "s" : ""}!`);
    this.client.sweeper.run();
    this.client.sweeper.task = setInterval(() => this.client.sweeper.run(), 600000);
  } 
}

module.exports = MiyakoReady;
