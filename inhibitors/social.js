const { Inhibitor } = require("klasa");

class Economy extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true
    });
  }

  async run(msg, command) {
    if(!msg.guild) return;
    if(!msg.guild.settings.social && (command.category === "Social" || command.cost || command.category === "Canvas")) throw `The social system is disabled and this command requires it, to enable it use \`${msg.guild.settings.prefix}social enable\``;
    if(!command.cost && command.category !== "Canvas") return;
    const { currency } = this.client.constants;
    // Automating cost adding for canvas commands like a pro
    const cost = command.category === "Canvas" ? 10 : command.cost;
    if(msg.member.settings.points < cost) throw `Insufficient balance, this command needs **${cost}** ${currency}. Your current balance: **${msg.member.settings.points}** ${currency}`;
    await msg.member.givePoints(command.category === "Canvas" ? -10 : -command.cost);
  }
}

module.exports = Economy;
