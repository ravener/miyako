const { Event, util: { codeBlock } } = require("klasa");
const { MessageEmbed } = require("discord.js");

class EventError extends Event {
  
  run(event, args, error) {
    this.client.emit("wtf", `[EVENT] ${event.path}\n${error ? error.stack ? error.stack : error : "Unknown error"}`);
    const channel = this.client.channels.get(this.client.constants.logsChannel);
    if(!channel) return;
    const embed = new MessageEmbed()
      .setTitle("EventError")
      .setDescription(`An Error occured in event: ${event.name}\n${codeBlock("js", error ? error.stack ? error.stack : error : "Unknown error")}`)
      .setColor(0xff0000);
    channel.send({ embed }).catch(() => null);
  }
}

module.exports = EventError;