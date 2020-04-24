const Command = require("../../structures/Command.js");

class Disable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Disables a command or event.",
      ownerOnly: true,
      usage: "m!disable <command|event>"
    });
  }

  async run(ctx, [piece]) {
    if(!piece) return ctx.reply("What am I supposed to disable?");
    piece = this.store.get(piece) || this.client.events.get(piece);
    if(!piece) return ctx.reply("That piece does not exist!");
    if(piece.store === this.client.events && piece.name === "message")
      return ctx.reply("Trust me you don't want to disable that one. You won't be able to do anything otherwise.");
    if(!piece.enabled) return ctx.reply(`**${piece.name}** is already disabled.`);
    piece.disable();
    return ctx.reply(`Successfully disabled the ${piece.store.name.slice(0, -1)} ${piece.name}`);
  }
}

module.exports = Disable;
