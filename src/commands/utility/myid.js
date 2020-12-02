const Command = require("../../structures/Command.js");

class MyID extends Command {
  constructor(...args) {
    super(...args, {
      description: "Retrieve your User ID."
    });
  }

  async run(msg) {
    return msg.sendLocale("COMMAND_MYID", [msg.author]);
  }
}

module.exports = MyID;
