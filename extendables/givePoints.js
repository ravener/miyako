const { Extendable } = require("klasa");

class GivePoints extends Extendable {
  constructor(...args) {
    super(...args, {
      appliesTo: ["GuildMember"]
    });
  }

  async extend(amount) {
    if(isNaN(parseInt(amount))) throw new Error("Amount must be a valid integer.");
    await this.settings.update("points", this.settings.points + parseInt(amount));
    return { total: this.settings.points, added: parseInt(amount) };
  }
}

module.exports = GivePoints;
