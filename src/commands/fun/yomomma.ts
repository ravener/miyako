import Command from '../../structures/Command.js';
import { request } from 'undici';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

class YoMomma extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Yo momma so fat.',
      aliases: ['urmom'],
      cooldown: 3,
      usage: 'yomomma [@user]',
      options: [
        {
          name: 'user',
          description: 'The user to insult their mom. By default that\'s you!',
          type: 'user'
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const user = options.getUser('user') ?? ctx.author;

    if (user.id === this.client.user!.id) {
      return ctx.reply('My mom is doing fine thanks, how about yours?');
    }

    const { joke } = await request('https://yomama-jokes.com/api/random')
      .then(({ body }) => body.json() as Promise<{ joke: string }>);

    return ctx.reply(`${user}, ${joke}`);
  }
}

export default YoMomma;
