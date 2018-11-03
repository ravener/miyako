const ToggleConfigCommand = require("../../structures/ToggleConfigCommand.js");

class AntiInvite extends ToggleConfigCommand {
  constructor(...args) {
    super(...args, {
      description: "Manage Anti Invite auto mod config.",
      key: "automod.invites",
      friendlyName: "anti invites",
      aliases: ["antilink", "automodinvites", "deleteinvites", "noadvertising", "noad"]
    });
  }
}

module.exports = AntiInvite;
