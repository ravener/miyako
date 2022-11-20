const Command = require("../../structures/Command.js");
const { random } = require("../../utils/utils.js");
const responses = require("../../utils/responses.js");

class Reload extends Command {
  constructor(...args) {
    super(...args, {
      description: "Reloads a command.",
      usage: "<piece>",
      ownerOnly: true,
      aliases: ["r"],
      modes: ["text"],
      options: [
        {
          name: "piece",
          description: "The piece to reload.",
          type: "string"
        }
      ]
    });
  }

  async run(ctx, options) {
    const pieceName = options.getString("piece");
    if (!pieceName) {
      return ctx.reply(random(responses.reloadMissingArg));
    }

    const piece = this.client.commands.get(pieceName) || this.client.events.get(pieceName);

    if (!piece) {
      return ctx.reply(random(responses.reloadNotFound)
        .replace(/{{user}}/g, ctx.author.username)
        .replace(/{{command}}/g, pieceName));
    }

    try {
      const reloaded = await piece.reload();
      return ctx.reply(random(responses.reloadSuccess)
        .replace(/{{command}}/g, reloaded.name));
    } catch(err) {
      piece.store.set(piece);
      return ctx.reply(random(responses.reloadErr)
        .replace(/{{command}}/g, piece.name)
        .replace(/{{response}}/g, err.message || err.toString()));
    }
  }
}

module.exports = Reload;
