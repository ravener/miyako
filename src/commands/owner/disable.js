const Command = require("../../structures/Command.js");

class Disable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Disables a command or event.",
      ownerOnly: true,
      usage: "m!disable <command|event>"
    });
  }

  async run(msg, [piece]) {
    if(!piece) return msg.send("What am I supposed to disable?");
    piece = this.store.get(piece) || this.client.events.get(piece);
    if(!piece) return msg.send("That piece does not exist!");
    if(piece.store === this.client.events && piece.name === "message")
      return msg.send("Trust me you don't want to disable that one. You won't be able to do anything otherwise.");
    if(!piece.enabled) return msg.send(`**${piece.name}** is already disabled.`);
    piece.disable();
    return msg.send(`Successfully disabled the ${piece.store.name.slice(0, -1)} ${piece.name}`);
  }
}

module.exports = Disable;
