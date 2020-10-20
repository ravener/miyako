const Command = require("../../structures/Command.js");

class Reverse extends Command {
  constructor(...args) {
    super(...args, {
      description: "Reverses your text.",
      usage: "reverse <text>",
      aliases: ["rev"]
    });
  }
  
  async run(msg, args) {
    if(!args.length) return msg.send("Baka! What am I supposed to reverse?");
    return msg.send(args.join(" ").split("").reverse().join(""));
  }
}

module.exports = Reverse;
