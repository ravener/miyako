const { Command } = require("klasa");

class Reverse extends Command {
  constructor(...args) {
    super(...args, {
      description: "Reverses your text.",
      usage: "<text:string>",
      aliases: ["rev"]
    });
  }
  
  async run(msg, [text]) {
    return msg.send(text.split("").reverse().join(""));
  }
}

module.exports = Reverse;