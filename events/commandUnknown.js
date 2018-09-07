const { Event } = require("klasa");

class CommandUnknown extends Event {

  async run(msg, cmd) {
    this.client.commands.get("tag").get(msg, cmd.toLowerCase());
  }
}

module.exports = CommandUnknown;
