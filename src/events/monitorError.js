const Event = require("../structures/Event.js");

class MonitorError extends Event {
  async run(monitor, err) {
    const channel = this.client.channels.cache.get("454776836929617921");
    if(!channel) return;

    const embed = this.client.embed()
      .setTitle("Monitor Error")
      .setDescription(`An Error occured in monitor: ${monitor.name}\n\`\`\`js\n${err.stack || err}\`\`\``);

    return channel.send({ embed }).catch(() => null);
  }
}

module.exports = MonitorError;
