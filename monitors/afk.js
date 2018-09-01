const { Monitor } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");

class AFK extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false
    });

    this.counter = new Map();
  }
  
  async run(message) {
    if(!message.guild) return;
    if(message.author.settings.afk.status) this.counter.set(message.author.id, (this.counter.get(message.author.id) || 0) + 1);
    if(message.author.settings.afk.status && this.counter.get(message.author.id) > 2) {
      await message.author.settings.update("afk.status", false);
      this.counter.delete(message.author.id);
      return message.channel.send(`**${message.member.displayName}** welcome back, i've turned off your afk status`);
    }
    if(message.mentions.users.size) {
      const afks = message.mentions.users.filter((x) => x.settings.afk.status && x.settings.afk.message && x.id !== message.author.id);
      if(!afks.size) return;
      return message.send(afks.map((x) => `**${x.username}** is AFK, message: \`${escapeMarkdown(x.settings.afk.message, true)}\`\n`));
    } 
  }
}

module.exports = AFK;
