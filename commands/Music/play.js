const { Command } = require("klasa");

class Play extends Command {
  constructor(...args) {
    super(...args, {
      description: "Plays a song!, NOTE: still work in progress",
      runIn: ["text"],
      usage: "<song:string>",
      requiredPermissions: ["CONNECT", "SPEAK"]
    });
  }

  async run(msg, [song]) {

    const player = this.client.lavalink.get(msg.guild.id) || await this.client.lavalink.join(msg.member.voice.channel, { selfDeaf: true });

    // URL support soon
    const track = await this.client.lavalink.getTracks(`ytsearch:${song}`);
    if(!track) throw "Track not found or an error occured, try again with another song";
    player.queue.push({ requester: msg.member, song: track.tracks[0] });
    if(player.playing) return msg.send(`Added **${track.tracks[0].title}** to the queue as requested by **${msg.member.displayName}**`);
    await this.play(msg, player);
  }

  async play(msg, player) {
    await player.play(player.queue[0].song.track);
    await msg.channel.send(`Now playing **${player.queue[0].song.title}** as requested by **${player.queue[0].requester.displayName}**`);
    player.on("trackEnd", async(track, reason) => {
      /* if(player.channel.members.size < 2) {
        await msg.channel.send("Uh guys? well i guess i'll stop the music since everyone left.");
        await this.client.lavalink.leave(player.channel.guild);
        return; 
      } */
      if(reason === "FINISHED") {
        if(player.looping) return this.play(msg, player);
        player.queue.shift();
        if(!player.queue.length) {
          await msg.channel.send("Queue is empty! leaving voice channel...");
          await this.client.lavalink.leave(player.channel.guild);
          return;
        }
        return this.play(msg, player);
      }
    });
  }
}

module.exports = Play;
