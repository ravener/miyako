const { Event } = require("klasa");

class CommandUnknown extends Event {
  
  async run(msg, cmd) {
    const tag = msg.guild.settings.tags.find((x) => x.name === cmd.toLowerCase());
    if(!tag) return;
    msg.send(tag.content.replace(/@(everyone|here)/g, "@\u200b$1"));
  }
}

module.exports = CommandUnknown;
