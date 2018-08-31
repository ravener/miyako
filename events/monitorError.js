const { Event, util: { codeBlock } } = require("klasa");
const { MessageEmbed } = require("discord.js");

class MonitorError extends Event {
  
  run(message, monitor, error) {
    this.client.console.wtf(`[MONITOR] ${monitor.path}\n${error ? error.stack ? error.stack : error : "Unknown error"}`);
    const channel = this.client.channels.get(this.client.constants.logsChannel);
    if(!channel) return;
    const embed = new MessageEmbed()
      .setTitle("MonitorError")
      .setDescription(`An Error occured in monitor: ${monitor.name}\n${codeBlock("js", error ? error.stack ? error.stack : error : "Unknown Error")}`)
      .setColor(0xff0000);
    channel.send({ embed }).catch(() => null);
  }
}

module.exports = MonitorError;