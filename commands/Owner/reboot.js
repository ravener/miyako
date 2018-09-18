const { Command } = require("klasa");

class Reboot extends Command {
  constructor(...args) {
    super(...args, {
      permissionLevel: 10,
      guarded: true,
      description: language => language.get("COMMAND_REBOOT_DESCRIPTION")
    });
  }

  async run(message) {
    await message.sendLocale("COMMAND_REBOOT").catch(err => this.client.emit("error", err));
    await Promise.all(this.client.providers.map(provider => provider.shutdown())).catch(() => null);
    process.exit();
  }
}

module.exports = Reboot;
