const { Event } = require("klasa");

class CommandUnknown extends Event {

  async run(msg, cmd, prefixLength) {
    const args = msg.content.slice(prefixLength).trim().split(/ +/g).slice(1);
    this.client.commands.get("tag").get(msg, cmd.toLowerCase(), args)
      .catch(() => null);
  }
}

module.exports = CommandUnknown;
