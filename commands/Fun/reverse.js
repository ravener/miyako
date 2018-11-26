const { Command } = require("klasa");
const { clean } = require("../../utils/utils.js");

class Reverse extends Command {
  constructor(...args) {
    super(...args, {
      description: "Reverses your text.",
      usage: "<text:string>",
      aliases: ["rev"]
    });
  }
  
  async run(msg, [text]) {
    return msg.send(clean(msg, text.split("").reverse().join("")));
  }
}

module.exports = Reverse;
