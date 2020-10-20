const Command = require("../../structures/Command.js");

class Enable extends Command {
  constructor(...args) {
    super(...args, {
      description: "Enables a command or event.",
      ownerOnly: true,
      usage: "m!enable <command|event>"
    });
  }

  async run(msg, [piece]) {
    if(!piece) return msg.send("What am I supposed to enable?");
    piece = this.store.get(piece) || this.client.events.get(piece);
    if(!piece) return msg.send("That piece does not exist!");
    if(piece.enabled) return msg.send(`**${piece.name}** is already enabled.`);
    piece.enable();
    return msg.send(`Successfully enabled the ${piece.store.name.slice(0, -1)} ${piece.name}`);
  }
}

module.exports = Enable;
