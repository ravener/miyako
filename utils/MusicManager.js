const ytdl = require("ytdl-core");
const getInfo = require("util").promisify(ytdl.getInfo);
const superagent = require("superagent");

/*
* A class to manage music, each guild will have a music
* property which is an instance of this class.
* Music isn't out yet and there is no any commands for it.
* Music coming soon and this class is still untested.
* If you found a problem or have feedback open an issue
* as its better to find bugs before production day.
* NOTE: as of 15/08/2018 this is now discontinued and starting to use Lavalink
* see Lavalink folder from this directory.
*/
class MusicManager {
  constructor(guild) {
    this.client = guild.client;
    this.guild = guild;
    this.queue = [];
    this.skippers = [];
    this.channel = null;
    this.regexes = [
      /youtu\.be\/([^&?#]+)/,
      /\?.*v=([^&?#]+)/,
      /\/v\/([^#?&]+)/,
      /embed\/([^&?#]+)(?:\?.*)?/,
      /user\/\S+(.{11})/
    ];
  }

  getID(url) {
    if(!/youtube\.com\/(\S+)/i.test(url) && !/youtu\.be\/(\S+)/i.test(url)) return null;
    for(const reg of this.regexes) {
      if(reg.test(url.trim())) return reg.exec(url.trim())[1];
    }  
    return null;
  }
  
  get playing() {
    return this.dispatcher ? !this.dispatcher.paused : false;
  }
  
  init(channel) {
    this.channel = channel;
  }
  
  get voiceChannel() {
    return this.guild.me.voiceChannel;
  }
  
  get connection() {
    return this.voiceChannel ? this.voiceChannel.connection : null;
  }
  
  get dispatcher() {
    return this.connection ? this.connection.dispatcher : null;
  }
  
  join(vc) {
    return vc.join();
  }
  
  async add(id, member) {
    const song = await getInfo(id).catch((err) => {
      this.client.emit("wtf", err);
      throw "Something went wrong with YouTube, please try again later.";
    });
    
    if(song.formats.some((format) => format.live)) {
      throw "Not supporting livestreams at this time.";
    }
    
    const data = {
      id: song.video_id,
      requester: member,
      info: song,
      title: song.title.replace(/@(everyone|here)/, "@\u200b$1"),
      length: song.length_seconds
    };
    
    this.queue.push(data);
    
    this.channel.send(`**${data.title}** added to queue, as requested by **${data.requester.displayName}**`);
    
    return data;
  }
  
  async search(query, member = null) {
    const id = this.getID(query);
    if(id && member) await this.add(id, member);
    if(id) return id[1];
    const res = await superagent.get("https://www.googleapis.com/youtube/v3/search")
      .query({ part: "id", type: "video", q: query, key: this.client.config.youtube })
      .then((res) => res.body.items[0].id.videoId)
      .catch(() => null);
    if(member) await this.add(res, member);
    return res;
  }
  
  pause() {
    if(!this.dispatcher) throw "Not playing anything.";
    this.dispatcher.pause();
  }
  
  destroy() {
    this.disconnect();
    this.channel = null;
    this.queue = [];
    this.skippers = [];
  }
  
  disconnect() {
    if(this.voiceChannel) {
      this.voiceChannel.leave();
    }
  }
  
  skip() {
    if(this.dispatcher) this.dispatcher.end();
  }
  
  skipVote(member) {
    if(!this.voiceChannel || !this.playing) throw "Not playing anything.";
    if(this.skippers.includes(member.id)) throw "You already voted to skip.";
    this.skippers.push(member.id);
    if(Math.floor(member.voiceChannel.members.size - 1) / 2 >= this.skippers.length) return this.skip();
    const votesNeeded = Math.ceil((this.voiceChannel.members.size - 1) / 2) - this.skippers.length;
    this.channel.send(`<@{member.id}> you vote has been added, you need **${votesNeeded}** more votes to skip`);
  }
  
  resume() {
    if(!this.dispatcher) throw "Nothing to resume.";
    if(this.playing) throw "Already playing.";
    this.dispatcher.resume();
  }
  
  async play() {
    if(!this.voiceChannel) return;
    if(this.playing) throw "Already playing.";
    if(this.queue.length === 0) throw "Queue is empty, queue up some more songs.";
    this.skippers = [];
    const song = this.queue.shift();
    const dispatcher = this.connection.play(ytdl.downloadFromInfo(song.info, { filter: "audioonly" }));
    this.channel.send(`Now playing **{song.title}** as requested by **${song.requester.displayName}**`);
    dispatcher.on("error", (err) => this.client.emit("error", err));
    dispatcher.on("debug", (msg) => this.client.emit("log", msg, "debug"));
    dispatcher.on("finish", () => {
      if(this.queue.length === 0) {
        this.channel.send("Queue is empty, queue up some more songs.");
        return setTimeout(() => {
          if(this.queue.length === 0) this.disconnect();
        }, 20 * 1000);
      }
      this.play();     
    });
  }
}

module.exports = MusicManager;