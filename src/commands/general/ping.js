const Command = require("../../structures/Command.js");
const { random } = require("../../utils/utils.js");
const { pingMessages } = require("../../utils/responses.js");

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pong! Checks Bot latency.",
      modes: ["text"]
    });
  }

  async run(ctx) { 
    const msg = await ctx.reply({
      content: "Ping?",
      fetchReply: true
    });

    const took = msg.createdTimestamp - ctx.createdTimestamp;

    return ctx.editReply({
      content: random(pingMessages)
        .replace(/{{ms}}/g, took)
        .replace(/{{user}}/g, ctx.author.username)
    });
  }
}

module.exports = Ping;
