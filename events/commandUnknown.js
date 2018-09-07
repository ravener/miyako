const { Event } = require("klasa");
const { post } = require("superagent");
const { Collection } = require("discord.js");

class CommandUnknown extends Event {
  constructor(...args) {
    super(...args);
    this.sessions = new Collection();
  }

  async run(msg, cmd) {
    const res = await this.client.commands.get("tag").get(msg, cmd.toLowerCase()).catch(() => false);
    if(res) return;
    // CleverBot
    if(msg.prefix !== this.client.options.regexPrefix || msg.prefix.toString() !== `/^<@!?${this.client.user.id}>/`) return; // Only work with mention and regex prefix
    await msg.channel.startTyping();
    const text = msg.content.slice(msg.prefixLength).trim();
    const session = this.sessions.get(msg.author.id) || await this.createAndSet(msg.author.id, msg.member ? msg.member.displayName : msg.author.username);
    this.ask(session, text)
      .then((r) => msg.send(r))
      .then(() => msg.channel.stopTyping(true))
      .catch((err) => this.client.emit("error", err));
  }

  ask(session, text) {
    return post("http://cleverbot.io/1.0/ask")
      .send({
        key: this.client.config.cleverbot.key,
        user: this.client.config.cleverbot.user,
        nick: session,
        text: text
      })
      .then((r) => r.body.response);
  }

  createSession(name) {
    return post("https://cleverbot.io/1.0/create")
      .send({
        key: this.client.config.cleverbot.key,
        user: this.client.config.cleverbot.user,
        nick: name
      })
      .then((r) => {
        if(!r.body.success) throw new Error(`API Error: ${r.status}`)
        return r.body.nick;
      });
  }

  createAndSet(user, name) {
    return this.createSession(name).then((n) => this.sessions.set(user, n)).then(() => this.sessions.get(user));
  }
}

module.exports = CommandUnknown;
