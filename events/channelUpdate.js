const { Event } = require("klasa");

class ChannelUpdate extends Event {
  
  run(old, channel) {
    if(channel.type === "dm") return;
    
    // Spot the difference
    const changes = [];
    if(channel.topic !== old.topic) changes.push({ field: "Topic", old: old.topic, now: channel.topic });
    if(channel.name !== old.name) changes.push({ field: "Name", old: old.name, now: channel.name });
    if(!changes.length) return;
    this.client.emit("modlogs", channel.guild, "channelUpdate", { name: "channels", old, channel, changes });
  }
}

module.exports = ChannelUpdate;