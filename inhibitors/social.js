const { Inhibitor } = require("klaaa");

class Economy extends Inhibitor {
  constructor(...args) {
    super(...args, {
      spamProtection: true
    });
  }

  async run(msg, command) {
    if(!msg.guild || (!command.cost && command.category !== "Canvas")) return;

    // Automating cost adding for canvas commands like a pro
    const cost = command.category === "Canvas" ? 10 : command.cost;
    if(msg.member.settings.points < cost) throw `Insufficient balance, this command needs **$${cost}**. Your current balance: **$${msg.member.settings.points}**`;
    await msg.member.givePoints(-command.cost);
    return true;
  }
}

module.exports = Economy;
