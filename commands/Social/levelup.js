const ToggleConfigCommand = require("../../structures/ToggleConfigCommand.js");

class Levelup extends ToggleConfigCommand {
  constructor(...args) {
    super(...args, {
      key: "levelup",
      friendlyName: "levelup messages",
      aliases: ["levelups", "lvlup", "lvlups"]
    });
  }
}

module.exports = Levelup;
