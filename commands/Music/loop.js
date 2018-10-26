const { Command } = require("klasa");

class Loop extends Command {
  constructor(...args) {
    super(...args, {
      description: "Toggles music looping",
      aliases: ["repeat", "toggleloop", "togglerepeat"]
    });
  }

  async run(msg) {
    const player = this.client.lavalink.get(msg.guild.id);
    if(!player) throw "Failed to find the player";
    if(player.looping) {
      player.looping = false;
      return msg.send("Turned off repeat mode");
    }
    player.looping = true;
    return msg.send("Turned on repeat mode");
  }
}

module.exports = Loop;
