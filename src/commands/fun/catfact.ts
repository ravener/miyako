import Command from '../../structures/Command.js';
import { request } from 'undici';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class CatFact extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      aliases: ['catfacts', 'kittenfact'],
      cooldown: 3,
      description: 'Let me tell you a misterious cat fact.',
      cost: 10
    });
  }

  async run(ctx: CommandContext) {
    const { fact } = await request('https://catfact.ninja/fact')
      .then(({ body }) => body.json() as Promise<{ fact: string }>);

    return ctx.reply(`📢 **Catfact:** *${fact}*`);
  }
}

export default CatFact;
