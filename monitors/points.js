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
    await msg.member.givePoints(points);
    const curLevel = Math.floor(0.1 * Math.sqrt(msg.member.settings.points));
    if(msg.member.settings.level < curLevel) {
      if(msg.guild.settings.levelup) {
        await msg.channel.send(`**${msg.member.displayName}**, congratulations! You've leveled up to level **${curLevel}**.`);
      }
      await msg.member.setLevel(curLevel);
    }
  }
}

module.exports = Points;
