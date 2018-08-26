const { Command } = require("klasa");

class Stop extends Command {
  constructor(...args) {
    super(...args, {
      description: "Stops Music",
      runIn: ["text"]
    });
  }

  async run(msg) {
    const player = this.client.lavalink.get(msg.guild.id);
    if(!player) throw "There isn't anything playing.";
    await player.stop();
    player.clearQueue();
    await player.destroy();
    await this.client.lavalink.leave(player.channel.guild);
    return msg.send("Stopped, cleared queue and left voice channel.");
  }
}

module.exports = Stop;
