import Event from '../structures/Event.js';
import { missingPermissions, plural } from '../utils/utils.js';

class InteractionCreate extends Event {
  async run(interaction) {
    return this.client.commands.handler.handleInteraction(interaction);
    /*
    if (!interaction.isChatInputCommand()) return;

    const command = this.client.commands.get(interaction.commandName);
    if (!command) return;

    const ctx = new CommandContext(command, { interaction });

    if (!(await this.checkPermissions(ctx, command))) return;
    if (!(await this.checkCooldown(ctx, command))) return;

    return command.execute(ctx);
    */
  }

  async checkCooldown(ctx, command) {
    const content = this.client.commands.ratelimit(ctx, command);

    if (typeof content === 'string') {
      await ctx.reply({ content, ephemeral: true });
      return false;
    }

    return true;
  }

  async checkPermissions(ctx, command) {
    const permissions = ctx.channel.permissionsFor(this.client.user);
    const missing = missingPermissions(permissions, command.botPermissions);

    if (missing.length) {
      await ctx.reply({
        content: `I need the following permission${plural(missing)} to run that command: **${missing.join(', ')}**`
      });

      return false;
    }

    return true;
  }
}

export default InteractionCreate;
