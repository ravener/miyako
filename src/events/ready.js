const Event = require("../structures/Event.js");

class ReadyEvent extends Event {
  async run() {
    const { user, log } = this.client;

    log.info(`Logged in as ${user.tag} (${user.id})`);
    log.info(`Bot is in ${this.client.guilds.cache.size} servers.`);

    // Clean up command contexts every hour to prevent big accumulations.
    this.cleanTask = setInterval(() => {
      this.client.commands.contexts.clear();
    }, 60 * 60 * 1000);
  }
}

module.exports = ReadyEvent;
