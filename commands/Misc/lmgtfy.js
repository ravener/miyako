const { Command } = require("klasa");

class LMGTFY extends Command {
  constructor(...args) {
    super(...args, {
      description: "Let me google it for you",
      aliases: ["letmegoogleitforyou"],
      usage: "<query:string>"
    });
  }

  async run(msg, [query]) {
    return msg.send(`http://lmgtfy.com/?q=${query.replace(/ /g, "+")}`);
  }
}

module.exports = LMGTFY;
