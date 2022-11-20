const Event = require("../structures/Event.js");
const { random } = require("../utils/utils.js");
const responses = require("../utils/responses.js");

class CommandError extends Event {
  run(ctx, err) {
    // Allow throw "string" to unwind stack from deepest calls
    // for replying with an error message.
    if (typeof err === "string") {
      return ctx.reply({ content: err });
    }

    this.client.log.error(err);

    if (ctx.owner) {
      return ctx.reply(random(responses.reloadErr)
        .replace(/{{command}}/g, ctx.command.name)
        .replace(/{{user}}/g, ctx.author.username)
        .replace(/{{response}}/g, err.message || err));
    } else {
      return ctx.reply("Something went wrong with the command, whoopsie! I have reportd it to my master, now you are gonna have to wait for it to be fixed.")
    }
  }
}

module.exports = CommandError;
