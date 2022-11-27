const Event = require("../structures/Event.js");

class ReadyEvent extends Event { 
  async run() {
    const { user, log } = this.client;

    log.info(`Logged in as ${user.tag} (${user.id})`);
    log.info(`Bot is in ${this.client.guilds.cache.size} servers.`);

    if (!this.client.dev) {
      // Post bot statistics to top.gg every 5 minutes.
      this.stats = setInterval(() => this.client.postStats(), 300000);
    }
  }
}

module.exports = ReadyEvent;
