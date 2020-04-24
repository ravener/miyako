const Command = require("../../structures/Command.js");

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pong! Checks Bot latency."
    });
  }

  async run(ctx, args) {
    const msg = await ctx.reply("Pong i guess?");
    return msg.edit(`Pong! Latency: **${msg.createdTimestamp - ctx.message.createdTimestamp} ms** API Latency: **${this.client.ws.ping} ms**`);
  }
}

module.exports = Ping;
