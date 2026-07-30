import Command from '../../structures/Command.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class Reboot extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Shuts down/Reboots the bot.',
      ownerOnly: true,
      aliases: ['shutdown', 'restart'],
      modes: ['text']
    });
  }

  async run(ctx: CommandContext) { // eslint-disable-line no-unused-vars
    await ctx.reply('Shutting down...');
    // await this.client.dbClient.close();
    process.exit();
  }
}

export default Reboot;
