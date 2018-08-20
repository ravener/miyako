const { Monitor } = require("klasa");
const { MessageEmbed, Util: { escapeMarkdown } } = require("discord.js");

class Highlight extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreOthers: false,
      ignoreEdits: true,
      ignoreBots: true,
      ignoreSelf: true
    });
  }

  async run(msg) {
    if(!msg.guild) return;
    const members = msg.guild.members.filter((x) => x.settings.highlight.enabled && x.settings.highlight.words.length && msg.channel.permissionsFor(x).has("VIEW_CHANNEL") && !x.settings.highlight.blacklistedChannels.includes(msg.channel.id));
    if(!members.size) return;
    members.forEach(async(x) => {
      const word = x.settings.highlight.words.find((x) => msg.content.toLowerCase().includes(x.toLowerCase()));
      if(!word) return;
      const msgs = await msg.channel.messages.fetch({ limit: 7, around: msg.id }).catch(() => null);
      if(!msgs) return;
      const embed = new MessageEmbed()
        .setTitle("Click Here to jump to the message")
        .setDescription(msgs.map((x) => `**${escapeMarkdown(x.author.tag)}** | ${escapeMarkdown(x.content)}`).join("\n"))
        .setTimestamp(msg.createdAt)
        .setColor(0xff0000)
        .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
        .setURL(msg.url);
      x.send(`You've been mentioned with the highlighted ${word.includes(" ") ? "phrase" : "word" } **${word}** in channel **${msg.channel.name}** of **${msg.guild.name}**`, { embed }).catch(() => null);
    });
  }
}

module.exports = Highlight;
