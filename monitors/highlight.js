const { Monitor, util: { regExpEsc } } = require("klasa");
const { MessageEmbed, Util: { escapeMarkdown } } = require("discord.js");

class Highlight extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
      ignoreEdits: true,
      ignoreBots: true,
      ignoreSelf: true
    });
    this.recentlyTalked = new Set();
  }

  async run(msg) {
    if(!msg.guild) return;
    if(!msg.member) await msg.guild.members.fetch(msg.author.id).catch(() => null);

    if(msg.member.settings.highlight.enabled && !this.recentlyTalked.has(msg.author.id)) {  
      this.recentlyTalked.add(msg.author.id);
      setTimeout(() => this.recentlyTalked.delete(msg.author.id), 1000 * 60 * 5);
    }

    const members = msg.guild.members.filter((x) => x.settings.highlight.enabled && x.settings.highlight.words.length && msg.channel.permissionsFor(x).has("VIEW_CHANNEL") && !x.settings.highlight.blacklistedChannels.includes(msg.channel.id) && !x.settings.highlight.blacklistedUsers.includes(msg.author.id) && x.id !== msg.author.id && !this.recentlyTalked.has(x.id));
    if(!members.size) return;
    members.forEach(async(x) => {
      const word = x.settings.highlight.words.find((x) => {
        return new RegExp(`\\b${regExpEsc(x)}\\b`, "i").test(msg.content);
      });
      if(!word) return;
      const msgs = await msg.channel.messages.fetch({ limit: 10, around: msg.id }).catch(() => null);
      if(!msgs) return;
      const embed = new MessageEmbed()
        .setTitle("Click Here to jump to the message")
        .setDescription(msgs.array().reverse().map((x) => `${escapeMarkdown(x.author.tag)}: ${x.content}`).join("\n"))
        .setTimestamp(msg.createdAt)
        .setColor(0xff0000)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setURL(msg.url);
      x.send(`You've been mentioned with the highlighted ${word.includes(" ") ? "phrase" : "word" } **${word}** in channel **#${msg.channel.name}** of **${msg.guild.name}**`, { embed }).catch(() => null);
    });
  }
}

module.exports = Highlight;
