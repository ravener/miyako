import Event from '../structures/Event.js';
import { missingPermissions, plural } from '../utils/utils.js';
import type { Interaction, TextChannel } from 'discord.js';
import type CommandContext from '../structures/CommandContext.js';
import type Command from '../structures/Command.js';

class InteractionCreate extends Event {
  async run(interaction: Interaction) {
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

  async checkCooldown(ctx: CommandContext, command: Command) {
    const content = (this.client.commands as any).ratelimit(ctx, command);

    if (typeof content === 'string') {
      await ctx.reply({ content, ephemeral: true });
      return false;
    }

    return true;
  }

  async checkPermissions(ctx: CommandContext, command: Command) {
    const permissions = (ctx.channel as TextChannel).permissionsFor(this.client.user!);
    const missing = missingPermissions(permissions!, command.botPermissions);

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
