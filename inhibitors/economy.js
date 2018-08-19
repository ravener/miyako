const { Inhibitor } = require("klaaa");

class Economy extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true
    });
  }

  async run(msg, command) {
    if(!msg.guild || !command.cost) return;
    if(msg.member.settings.points < command.cost) throw `Insufficient balance, this command needs **$${command.cost}**. Your current balance: **$${msg.member.settings.points}**`;
    await msg.member.givePoints(-command.cost);
    return true;
  }
}

module.exports = Economy;
