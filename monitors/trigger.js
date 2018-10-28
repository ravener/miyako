const { Monitor, util: { regExpEsc } } = require("klasa");

class Trigger extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false
    });
  }

  async run(msg) {
    if(!msg.guild || !msg.guild.settings.triggers.length || msg.command) return;
    for(const obj of msg.guild.settings.triggers) {
      if(new RegExp(`\\b${regExpEsc(obj.word)}\\b`, "ig").test(msg.content)) {
        await msg.send(obj.response);
        break;
      }
    }
  }
}

module.exports = Trigger;
