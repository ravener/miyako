const Command = require("../../structures/Command.js");

class MyID extends Command {
  constructor(...args) {
    super(...args, {
      description: "Retrieve your User ID."
    });
  }

  async run(msg) {
    return msg.send(`${msg.author} Your User ID is: **${msg.author.id}**`);
  }
}

module.exports = MyID;
