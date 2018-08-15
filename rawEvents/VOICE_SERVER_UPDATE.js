const RawEvent = require("../structures/RawEvent.js");

class VoiceServerUpdate extends RawEvent {
  
  run(d) {
    return this.client.lavalink.voiceServerUpdate(d);
  }
}

module.exports = VoiceServerUpdate;
