const { Event } = require("klasa");
const Cleverbot = require("cleverbot.io");

class CommandUnknown extends Event {
  constructor(...args) {
    super(...args);
    this.bot = new Cleverbot(this.client.config.cleverbot.user, this.client.config.cleverbot.key);
    this.bot.setNick("Ladybug");
  }

  async run(msg, cmd) {
    const res = await this.client.commands.get("tag").get(msg, cmd.toLowerCase()).catch(() => false);
    if(res) return;
    // CleverBot
    if(msg.prefix !== this.client.options.regexPrefix || msg.prefix.toString() !== `/^<@!?${this.client.user.id}>/`) return; // Only work with mention and regex prefix
    await msg.channel.startTyping();
    const text = msg.content.slice(msg.prefixLength).trim();
    return this.bot.ask(text, (err, res) => {
      if(err) throw err;
      return msg.send(res);
    });
  }
}

module.exports = CommandUnknown;
