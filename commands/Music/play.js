const { Command } = require("klasa");

class Play extends Command {
  constructor(...args) {
    super(...args, {
      description: "Plays a song!, NOTE: still work in progress",
      runIn: ["text"],
      usage: "<song:string>",
      requiredPermissions: ["CONNECT", "SPEAK"]
    });
    this.playing = false;
  }

  async run(msg, [song]) {

    const player = await this.client.lavalink.join(msg.member.voice.channel, { selfDeaf: true });

    // URL support soon
    const track = await this.client.lavalink.getTracks(`ytsearch:${song}`);
    if(!track) throw "Track not found or an error occured, try again with another song";
    player.queue.push({ requester: msg.member, song: track[0] });
    if(this.playing) return msg.send(`Added **${track.title}** to the queue as requested by **${msg.member.displayName}**`);
    await this.play(msg, player);
  }

  async play(msg, player) {
    const track = player.queue.shift();
    if(!track) return;
    await player.play(track.song.track);
    await msg.channel.send(`Now playing **${track.song.title}** as requested by **${track.requester.displayName}**`);
    player.on("trackEnd", async(track, reason) => {
      if(reason === "FINISHED") {
        if(!player.queue.length) {
          await msg.send("Queue is empty! leaving voice channel...");
          await this.client.lavalink.leave(player.channel.guild);
          this.playing = false;
          return;
        }
        return this.play(msg, player);
      }
    });
  }
}

module.exports = Play;
