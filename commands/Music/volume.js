const { Command } = require("klasa");

class Volume extends Command {
  constructor(...args) {
    super(...args, {
      description: "Sets the volume for music",
      aliases: ["setvolume"],
      usage: "(volume:volume)"
    });

    this.createCustomResolver("volume", (arg, possible, msg) => {
      if(!arg) return undefined;
      possible.max = 1000;
      return this.client.arguments.get("integer").run(arg, possible, msg);
    });
  }

  async run(msg, [volume]) {
    const player = this.client.lavalink.get(msg.guild.id);
    if(!player) throw "Couldn't find the player for this guild";
    if(!player.playing) throw "Nothing is playing";
    if(!volume) return msg.send(`Current Volume is set to **${player.volume}**`);
    await player.setVolume(volume);
    return msg.send(`Set Volume to **${volume}**`);
  }
}

module.exports = Volume;
