const { Command } = require("klasa");

class Pause extends Command {
  constructor(...args) {
    super(...args, {
      description: "Pauses a playing song.",
      runIn: ["text"]
    });
  }

  async run(msg) {
    const player = this.client.lavalink.get(msg.guild.id);
    if(!player) throw "There is nothing playing.";
    if(player.paused) throw "Music is already paused.";
    await player.pause();
    return msg.send("Paused music.");
  }
}

module.exports = Pause;
