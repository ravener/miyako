const { Event } = require("klasa");

class ChannelDelete extends Event {
  
  run(channel) {
    if(channel.type === "dm") return;
    this.client.emit("modlogs", channel.guild, "channelDelete", { name: "channels", channel });
  }
}

module.exports = ChannelDelete;