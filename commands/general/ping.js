const Command = require("../../structures/Command.js");

class Ping extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pong! Checks Bot latency."
    });
  }

  async run(ctx, args) {
    const msg = await ctx.reply("Ping?");

    return msg.edit(this.client.utils.random(this.client.responses.pingMessages)
      .replace(/{{user}}/g, ctx.guild ? ctx.member.displayName : ctx.author.username)
      .replace(/{{ms}}/g, `${msg.createdTimestamp - ctx.message.createdTimestamp}`));
  }
}

module.exports = Ping;
