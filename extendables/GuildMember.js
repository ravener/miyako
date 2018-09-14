const { Extendable } = require("klasa");
const { GuildMember } = require("discord.js");

class GuildMemberExtendable extends Extendable {
  constructor(...args) {
    super(...args, {
      appliesTo: [GuildMember]
    });
  }

  async givePoints(amount) {
    if(isNaN(parseInt(amount))) throw new Error("Amount must be a valid integer.");
    await this.settings.update("points", this.settings.points + parseInt(amount));
    return { total: this.settings.points, added: parseInt(amount) };
  }

  async setLevel(level) {
    if(isNaN(parseInt(level))) throw new Error("Level must be a valid integer.");
    await this.settings.update("level", parseInt(level));
    return this.settings.level;
  }
}

module.exports = GuildMemberExtendable;
