const { Event } = require("klasa");

class ChannelCreate extends Event {
  
  run(channel) {
    if(channel.type === "dm") return;
    this.client.emit("modlogs", channel.guild, "channelCreate", { channel, name: "channels" });
  }
}

module.exports = ChannelCreate;