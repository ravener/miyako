const Command = require("../../structures/Command.js");
const fetch = require("node-fetch");

class OwOify extends Command {
  constructor(...args) {
    super(...args, {
      description: "OwO What is this?",
      cooldown: 3,
      aliases: ["owo"],
      usage: "owoify <text>"
    });
  }

  async run(ctx, args) {
    const text = args.join(" ");

    // The reply is exactly what the API gives, to minimize requests we handle that condition ourselves.
    if(!text || text.length > 200) return ctx.reply("oopsie whoopsie you made a fucky wucky, no text or text over 200");

    const { msg } = await fetch(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(args.join(" "))}`)
      .then((res) => res.json());
    
    return ctx.reply(msg);
  }
}

module.exports = OwOify;
