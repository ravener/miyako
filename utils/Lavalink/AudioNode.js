const WebSocket = require("ws");
const EventEmitter = require("events");

class AudioNode extends EventEmitter {
  constructor(manager, options = {}) {
    super();
    this.manager = manager;
    this.ws = null;
    this.port = options.port;
    this.password = options.password;
    this.host = options.host;
    this.stats = {};
  }
  
  connect() {
    const ws = this.ws = new WebSocket(`ws://${this.host}:${this.port}`, {
      headers: {
        Authorization: this.password,
        "Num-Shards": this.manager.shards,
        "User-Id": this.client.user.id
      }
    });
    ws.onopen = this.open.bind(this);
    ws.onmessage = this.message.bind(this);
    ws.onclose = this.close.bind(this);
    ws.onerror = this.error.bind(this);
  }

  debug(type, msg, data) {
    return this.manager.emit("debug", this, type, msg, data);
  }

  open() {
    this.debug("open", "Lavalink Connection opened.");
  }

  close(code, reason) {
    this.debug("close", `Connection closed with code ${code}${reason ? `, with reason ${reason}` : "" }`);
    if(code === 1000) return;
    this.debug("reconnect", "Reconnnecting...");
    this.connect();
  }

  error(err) {
    this.client.emit("error", err);
  }

  message(message) {
    const msg = JSON.parse(message.data);
    switch(msg.op) {
      case "stats":
        this.stats = msg;
        break;
      case "event":
        this.event(msg);
        break;
      case "playerUpdate": {
        const player = this.manager.get(msg.guildId);
        if(!player) break;
        player._update(msg);
        break;
      }
      default:
        this.manager.emit("warn", `Unhandled OPCode: ${msg.op}`);
        break;
    }
  }

  event(data) {
    const player = this.manager.get(data.guildId);
    if(!player) return;
    switch(data.type) {
      case "TrackEndEvent":
        this.manager.emit("trackEnd", data.track, data.reason);
        break;
      case "TrackExceptionEvent":
        this.manager.emit("trackException", data.track, data.error);
        break;
      case "TrackStuckEvent":
        this.manager.emit("trackStuck", data.track, data.thresholdMs);
        break;
      default:
        this.manager.emit("warn", `Unhandled event ${data.type}`);
        break;
    }
  }

  send(data = {}) {
    return new Promise((resolve, reject) => {
      if(!this.ws || this.ws.readyState !== WebSocket.OPEN) return resolve(null);
      return this.ws.send(JSON.stringify(data), (err) => {
        if(err) return reject(err);
        this.debug("packetSent", "Sent a JSON packet.", JSON.stringify(data, null, 2));
        return resolve(data);
      });
    });
  }
}

module.exports = AudioNode;
