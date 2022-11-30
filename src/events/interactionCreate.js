const Event = require("../structures/Event.js");
const CommandContext = require("../structures/CommandContext.js");
const { missingPermissions, plural } = require("../utils/utils.js");

class InteractionCreate extends Event {
  async run(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);
    if (!command) return;

    const ctx = new CommandContext(command, { interaction });

    if (!(await this.checkPermissions(ctx, command))) return;

    return command.execute(ctx);
  }

  async checkPermissions(ctx, command) {
    const permissions = ctx.channel.permissionsFor(this.client.user);
    const missing = missingPermissions(permissions, command.botPermissions);

    if (missing.length) {
      await ctx.reply({
        content: `I need the following permission${plural(missing)} to run that command: **${missing.join(", ")}**`
      });

      return false;
    }

    return true;
  }
}

module.exports = InteractionCreate;
