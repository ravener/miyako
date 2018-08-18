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
  }

  async run(msg) {
    if(!msg.guild || msg.command) return;
    const points = Math.floor(Math.random() * 5) + 1;
    await this.givePoints(msg.member, points);
    const curLevel = Math.floor(0.1 * Math.sqrt(msg.member.settings.points));
    if(msg.member.settings.level < curLevel) {
      if(msg.guild.settings.levelup) {
        await msg.channel.send(`**${msg.member.displayName}**, Congratulations you've leveled up to level **${curLevel}**`);
      }
      await this.setLevel(msg.member, curLevel);
    }
  }

  async givePoints(member, amount) {
    await member.settings.update("points", member.settings.points + amount);
  }

  async setLevel(member, lvl) {
    await member.settings.update("level", lvl);
  }
}

module.exports = Points;
