const Event = require("../structures/Event.js");

class CommandError extends Event {
  run(ctx, err) {
    // Allow throw "string" to unwind stack from deepest calls
    // for replying with an error message.
    if (typeof err === "string") {
      return ctx.reply({ content: err });
    }

    this.client.log.error(err);
  }
}

module.exports = CommandError;
