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

  async run(ctx, [pieceName]) {
    if(!pieceName) return ctx.reply("What am I supposed to reload?");
    const piece = this.client.commands.get(pieceName) || this.client.events.get(pieceName);
    if(!piece) return ctx.reply("I couldn't find that piece! It wasn't a command nor an event.");
    try {
      const reloaded = await piece.reload();
      return ctx.reply(`Successfully reloaded the ${piece.store.name.slice(0, -1)}: **${reloaded.name}**`);
    } catch(err) {
      piece.store.set(piece);
      return ctx.reply(`Failed to reload **${piece.name}:** \`${err.message || err.toString()}\``);
    }
  }
}

module.exports = Reload;
