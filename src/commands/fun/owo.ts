import Command from '../../structures/Command.js';
import { request } from 'undici';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

class OwO extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'OwO What is this?',
      cooldown: 3,
      aliases: ['owoify', 'uwu', 'uwuify'],
      usage: 'owo <text>',
      options: [
        {
          name: 'text',
          description: 'Text to owoify',
          type: 'string',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const text = options.getString('text');

    // The reply is exactly what the API gives, to minimize requests we handle that condition ourselves.
    if (!text || text.length > 200) {
      return ctx.reply('oopsie whoopsie you made a fucky wucky, no text or text over 200');
    }

    const { owo } = await request(`https://nekos.life/api/v2/owoify?text=${encodeURIComponent(text)}`)
      .then(({ body }) => body.json() as Promise<{ owo: string }>);

    return ctx.reply(owo);
  }
}

export default OwO;
