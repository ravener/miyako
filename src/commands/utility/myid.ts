import Command from '../../structures/Command.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class MyID extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Retrieve your User ID.',
      modes: ['text']
    });
  }

  async run(ctx: CommandContext) {
    return ctx.reply(`Your User ID is: **${ctx.author.id}**`);
  }
}

export default MyID;
