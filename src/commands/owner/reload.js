const Command = require("../../structures/Command.js");

class Reload extends Command {
  constructor(...args) {
    super(...args, {
      description: "Reloads a command.",
      usage: "m!reload <piece>",
      ownerOnly: true,
      aliases: ["r"]
    });
  }

  async run(msg, [pieceName]) {
    if(!pieceName) return msg.send(this.client.utils.random(msg.language.get("RELOAD_MISSING_ARG")));

    const piece = this.client.commands.get(pieceName) || this.client.events.get(pieceName) ||
      this.client.monitors.get(pieceName);

    if(!piece) return msg.send(this.client.utils.random(msg.language.get("RELOAD_NOT_FOUND")));

    try {
      const reloaded = await piece.reload();
      return msg.send(this.client.utils.random(this.client.responses.reloadSuccess)
        .replace(/{{command}}/g, reloaded.name));
    } catch(err) {
      piece.store.set(piece);
      return msg.send(this.client.utils.random(msg.language.get("RELOAD_ERR_UNLOAD"))
        .replace(/{{command}}/g, piece.name)
        .replace(/{{response}}/g, err.message || err.toString()));
    }
  }
}

module.exports = Reload;
