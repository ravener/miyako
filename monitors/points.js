const { Monitor } = require("klasa");

class Points extends Monitor {
  constructor(...args) {
    super(...args, {
      ignoreSelf: true,
      ignoreBots: true,
      ignoreOthers: false,
      ignoreEdits: true,
      ignoreBlacklistedGuilds: true,
      ignoreBlacklistedUsers: true
    });
    this.timeouts = new Set();
  }

  async run(msg) {
    if(!msg.guild || msg.command) return;
    if(!msg.guild.settings.social) return;
    if(this.timeouts.has(msg.author.id)) return;
    if(!msg.member) await msg.guild.members.fetch(msg.author.id).catch(() => null);
    const points = Math.floor(Math.random() * 5) + 1;
    await msg.member.givePoints(points);
    const curLevel = Math.floor(0.1 * Math.sqrt(msg.member.settings.points));
    if(msg.member.settings.level < curLevel) {
      if(msg.guild.settings.levelup) {
        await msg.channel.send(`**${msg.member.displayName}**, congratulations! You've leveled up to level **${curLevel}**.`).catch(() => null);
      }
      await msg.member.setLevel(curLevel);
    }
    this.timeouts.add(msg.author.id);
    setTimeout(() => this.timeouts.delete(msg.author.id), 5000);
  }
}

module.exports = Points;
