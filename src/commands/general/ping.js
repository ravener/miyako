const Command = require("../../structures/Command.js");

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pong! Checks Bot latency.",
      modes: ["slash", "text"]
    });
  }

  async run(ctx) { 
    const msg = await ctx.reply({
      content: "Pong!",
      fetchReply: true
    });

    const took = msg.createdTimestamp - ctx.createdTimestamp;
    const latency = this.client.ws.ping;

    return ctx.editReply({
      content: `Pong! Took **${took}ms** API Latency **${latency}ms**`
    });
  }
}

module.exports = Ping;
