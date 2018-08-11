const { Monitor } = require("klasa");
const { Util: { escapeMarkdown } } = require("discord.js");

class AFK extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false
    });
  }
  
  run(message) {
    if(!message.guild) return;
    if(message.mentions.users.size) {
      const afks = message.mentions.users.filter((x) => x.settings.afk.status && x.settings.afk.message && x.id !== message.author.id);
      if(!afks.size) return;
      return message.send(afks.map((x) => `**${x.username}** is AFK, message: \`${escapeMarkdown(x.settings.afk.message, true)}\`\n`));
    } 
  }
  
  async init() {
    const { schema } = this.client.gateways.users;
    if(!schema.has("afk")) await schema.add("afk", {
      status: { type: "boolean" },
      message: { type: "string" }
    });
  }
}

module.exports = AFK;