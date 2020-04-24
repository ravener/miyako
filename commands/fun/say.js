const Command = require("../../structures/Command.js");

class Say extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["echo", "talk", "repeat", "saymiyako", "miyakosay"],
      description: "I will say whatever you want me to.",
      usage: "say <message>"
    });
  }

  async run(ctx, args) {
    if(ctx.message.deletable) await ctx.message.delete();
    return ctx.reply(args.join(" "), { disableMentions: "all" });
  }
}

module.exports = Say;
