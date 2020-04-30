const Command = require("../../structures/Command.js");

class SwapCase extends Command {
  constructor(...args) {
    super(...args, {
      description: "swap the case of a message.",
      usage: "swapcase <text>",
      aliases: ["scase"]
    });
  }

  async run(ctx, args) {
    if(!args.length) return ctx.reply("Baka! You didn't give me any input.");

    return ctx.reply(args.join(" ").replace(/\w/g, (ch) => {
      const up = ch.toUpperCase();
      return ch === up ? ch.toLowerCase() : up;
    }));
  }
}

module.exports = SwapCase;
