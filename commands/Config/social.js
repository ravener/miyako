const ToggleConfigCommand = require("../../structures/ToggleConfigCommand.js");

class Social extends ToggleConfigCommand {
  constructor(...args) {
    super(...args, {
      key: "social",
      aliases: ["socialsystem"],
      friendlyName: "social system"
    });
  }
}

module.exports = Social;
