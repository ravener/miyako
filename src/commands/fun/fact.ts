import Command from '../../structures/Command.js';
import { request } from 'undici';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class Fact extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Get a random fact.',
      aliases: ['facts', 'randomfact', 'randomfacts'],
      cooldown: 3
    });
  }

  async run(ctx: CommandContext) {
    const { fact } = await request('https://nekos.life/api/v2/fact')
      .then(({ body }) => body.json() as Promise<{ fact: string }>);

    return ctx.reply(fact);
  }
}

export default Fact;
