import Command from '../../structures/Command.js';
import { random } from '../../utils/utils.js';

class Coin extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Flip a coin.',
      cost: 5,
      aliases: ['coinflip', 'flipcoin']
    });
  }

  async run(ctx) {
    const flipped = random(['Heads', 'Tails']);
    return ctx.reply(`The coin landed on \`${flipped}\``);
  }
}

export default Coin;
