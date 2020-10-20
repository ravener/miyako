const Command = require("../../structures/Command.js");

class SwapCase extends Command {
  constructor(...args) {
    super(...args, {
      description: "swap the case of a message.",
      usage: "swapcase <text>",
      aliases: ["scase"]
    });
  }

  async run(msg, args) {
    if(!args.length) return msg.send("Baka! You didn't give me any input.");

    return msg.send(args.join(" ").replace(/\w/g, (ch) => {
      const up = ch.toUpperCase();
      return ch === up ? ch.toLowerCase() : up;
    }));
  }
}

module.exports = SwapCase;
