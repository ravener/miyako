const { Command } = require("klasa");

class Resume extends Command {
  constructor(...args) {
    super(...args, {
      description: "Resumes a paused music.",
      runIn: ["text"]
    });
  }

  async run(msg) {
    const player = this.client.lavalink.get(msg.guild.id);
    if(!player) throw "There isn't any player here.";
    if(!player.paused) throw "Music isn't paused.";
    await player.resume();
    return msg.send("Resumed music.");
  }
}

module.exports = Resume;
