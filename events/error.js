const { Event, util: { codeBlock } } = require("klasa");
const { MessageEmbed } = require("discord.js");

class ErrorEvent extends Event {
  
  run(err) {
    this.client.console.error(err);
    const channel = this.client.channels.get(this.client.constants.logsChannel);
    if(!channel) return;
    const embed = new MessageEmbed()
      .setTitle("Error")
      .setDescription(`An Error occured:\n${codeBlock("js", err ? err.stack ? err.stack : err : "Unknown Error")}`)
      .setColor(0xff0000);
    channel.send({ embed }).catch(() => null);
  }
}

module.exports = ErrorEvent;