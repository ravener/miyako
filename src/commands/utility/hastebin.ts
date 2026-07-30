import Command from '../../structures/Command.js';
import { request } from 'undici';
import { getCodeBlock } from '../../utils/utils.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class Hastebin extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      aliases: ['hb'],
      description: 'Upload some code to hastebin.',
      usage: 'hastebin <code>',
      cooldown: 5,
      modes: ['text']
    });
  }

  async run(ctx: CommandContext) {
    if (!ctx.args.length) {
      return ctx.reply('Baka! What am I supposed to upload?');
    }

    const { code, lang } = getCodeBlock(ctx.rawArgs);
    const { key } = await request('https://hastebin.com/documents', {
      method: 'POST',
      body: code
    })
      .then(({ body, statusCode }) => {
        if (statusCode !== 200) {
          throw `Something went wrong with Hastebin. Try again later. (Status: ${statusCode})`;
        }

        return body.json() as Promise<{ key: string }>;
      });

    const url = `https://hastebin.com/${key}${lang || ''}`;
    return ctx.reply(`Hastebin-ified: ${url}`);
  }
}

export default Hastebin;
