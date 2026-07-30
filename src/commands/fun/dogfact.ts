import Command from '../../structures/Command.js';
import { request } from 'undici';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class DogFact extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      aliases: ['dogfacts'],
      description: 'Gives you a random dog fact.',
      cooldown: 5
    });
  }

  async run(ctx: CommandContext) {
    const fact = await request('https://dog-api.kinduff.com/api/facts?number=1')
      .then(({ body }) => body.json() as Promise<{ facts: string[] }>)
      .then((body) => body.facts[0]);

    return ctx.reply(`📢 **Dogfact:** *${fact}*`);
  }
}

export default DogFact;
