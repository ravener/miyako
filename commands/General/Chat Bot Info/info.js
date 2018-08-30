const { Command } = require("klasa");

class Info extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["details", "what"],
      guarded: true,
      description: language => language.get("COMMAND_INFO_DESCRIPTION")
    });
  }
  
  async run(msg) {
    return msg.sendLocale("COMMAND_INFO", [msg.guild]);
  }
}

module.exports = Info;