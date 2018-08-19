const { Extendable } = require("klasa");

class SetLevel extends Extendable {
  constructor(...args) {
    super(...args, {
      appliesTo: ["GuildMember"]
    });
  }

  async extend(level) {
    if(isNaN(parseInt(level))) throw new Error("Level must be a valid integer.");
    await this.settings.update("level", parseInt(level));
    return this.settings.level;
  }
}

module.exports = SetLevel;
