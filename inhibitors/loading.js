const { Inhibitor } = require("klasa");

class Loading extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true
    });
  }

  async run(msg, command) {
    if(!command.loading || !msg.guild) return;
    await msg.send(command.loading
      .replace(/{{displayName}}/g, msg.member.displayName)
      .replace(/{{username}}/g, msg.author.username)
      .replace(/{{tag}}/g, msg.author.tag)
      .replace(/{{mention}}/g, msg.member.toString())
      .replace(/{{guild}}/g, msg.guild.name)
    ).catch(() => null);
    return true;
  }
}

module.exports = Loading;
