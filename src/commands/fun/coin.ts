import Command from '../../structures/Command.js';
import { random } from '../../utils/utils.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class Coin extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Flip a coin.',
      cost: 5,
      aliases: ['coinflip', 'flipcoin']
    });
  }

  async run(ctx: CommandContext) {
    const flipped = random(['Heads', 'Tails']);
    return ctx.reply(`The coin landed on \`${flipped}\``);
  }
}

export default Coin;
