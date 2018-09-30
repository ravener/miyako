const EventEmitter = require("events");
const AudioNode = require("./AudioNode.js");
const superagent = require("superagent");
const AudioTrack = require("./AudioTrack.js");
const { Guild, Constants: { OPCodes } } = require("discord.js");
const AudioPlayer = require("./AudioPlayer.js");
const { Collection } = require("discord.js");

class AudioManager extends EventEmitter {
  constructor(client, { nodes = [], rest = {}, shards = 1, userID } = {}) {
    super();
    this.players = new Collection();
    this.client = client;
    this.userID = userID;
    this.nodes = new Collection();
    this.shards = shards;
    this.rest = {
      host: rest.host || "localhost",
      port: rest.port || 2333,
      password: rest.password || "youshallnotpass"
    };
    for(const n of nodes) {
      this.addNode(n);
    }
  }

  get(id) {
    return this.players.get(id);
  }

  async _join(channel, { selfDeaf = false, selfMute = false } = {}) {
    /* eslint-disable camelcase */  
    await this.client.ws.send({
      op: OPCodes.VOICE_STATE_UPDATE,
      d: {
        channel_id: channel.id,
        guild_id: channel.guild.id,
        self_deaf: selfDeaf,
        self_mute: selfMute
      }
    });
    /* eslint-enable camelcase */
  }

  async join(channel, { selfDeaf = false, selfMute = false, node = this.nodes.first() } = {}) {
    await this._join(channel, { selfDeaf, selfMute });
    const player = this.get(channel.guild.id);
    if(player && player.alive) return player;
    const p = new AudioPlayer(channel, node);
    this.players.set(p.guild.id, p);
    return p;
  }

  async leave(guild) {
    if(!(guild instanceof Guild)) guild = this.client.guilds.get(guild);
    if(!guild) throw new Error("Invalid Guild.");
    await this._join({ id: null, guild });
    const player = this.get(guild.id);
    if(!player) return;
    if(player.alive) await player.destroy();
    this.players.delete(player.guild.id);
  }

  addNode(n) {
    if(!n || !n.port || !n.password || !n.host) throw new Error("Invalid argument, must be an object with { port, host, password }");
    const node = new AudioNode(this, n);
    if(this.nodes.has(node.host)) throw new Error(`Node with host '${node.host}' already exists.`);
    node.connect();
    this.nodes.set(node.host, node);
    return node;
  }

  removeNode(host) {
    const node = this.nodes.get(host);
    if(!node) throw new Error("Invalid node.");
    node.destroy();
    this.nodes.delete(host);
  }
  
  _convert(tracks) {
    for (const track of tracks) track = new AudioTrack(track);
    return tracks;  
  }

  getTracks(identifier) {
    return superagent.get(`http://${this.rest.host}:${this.rest.port}/loadtracks`)
      .query({ identifier })
      .set("Authorization", this.rest.password)
      .then((res) => {
          if (Array.isArray(res.body)) {
          if (res.body.length) return { tracks: this._convert(res.body) }
            return null;
          }
          // Lavalink version 3.0
          if (res.body.loadType === "NO_MATCHES" || res.body.loadType === "LOAD_ERROR") return null;
          if (res.body.loadType === "SEARCH_RESULT" || res.body.loadType === "TRACK_LOADED") return { tracks: this._convert(res.body.tracks) };
          if (res.body.loadType === "PLAYLIST_LOADED") return { name: res.body.playlistInfo.name, tracks: this._convert(res.body.tracks) };
      })
      .catch(() => null);
  }

  voiceServerUpdate(d) {
    if(!this.client.guilds.has(d.guild_id)) return;
    const player = this.get(d.guild_id);
    if(!player) return;
    player.node.send({
      op: "voiceUpdate",
      guildId: player.guild.id,
      sessionId: player.guild.me.voice.sessionID,
      event: d
    });
  }
}

module.exports = AudioManager;
