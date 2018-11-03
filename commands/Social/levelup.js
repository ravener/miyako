const ToggleConfigCommand = require("../../structures/ToggleConfigCommand.js");

class Levelup extends ToggleConfigCommand {
  constructor(...args) {
    super(...args, {
      key: "levelup",
      friendlyName: "Levelup messages",
      aliases: ["levelups", "lvlup", "lvlups"]
    });
  }
}

module.exports = Levelup;
