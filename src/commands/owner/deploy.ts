import Command from '../../structures/Command.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

class Deploy extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Deploys slash commands.',
      ownerOnly: true,
      modes: ['text']
    });
  }

  async run(ctx: CommandContext) {
    try {
      const body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

      for (const command of this.client.commands.values() as IterableIterator<Command>) {
        if (command.modes.includes('slash') && command.enabled && !command.ownerOnly) {
          body.push(command.getSlashCommandData()!.toJSON());
        }
      }

      await this.client.application!.commands.set(body);
      return ctx.reply(`Successfully registered ${body.length} application commands.`);
    } catch (err: any) {
      return ctx.reply(`There was an error registering commands: \`${err.message}\``);
    }
  }
}

export default Deploy;
