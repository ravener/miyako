import Command from '../../structures/Command.js';
import { STATUS_CODES } from 'http';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

class HttpStatus extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'HTTP Status codes with Cats!',
      aliases: ['httpcat', 'cathttp'],
      usage: 'httpstatus <status>',
      options: [
        {
          name: 'status',
          description: 'HTTP Status Code',
          type: 'integer',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const status = options.getInteger('status');

    // 599 is not in Node.js but it's on http.cat so let's handle it.
    if ((status as unknown) !== '599' && !STATUS_CODES[status]) {
      return ctx.reply('Baka! That\'s an invalid http status code.');
    }

    const embed = this.client.embed(ctx.author)
      .setTitle('HTTP Cat')
      .setImage(`https://http.cat/${status}.jpg`)
      .setDescription((status as unknown) === '599' ? 'Network Connect Timeout Error' : STATUS_CODES[status]!);

    return ctx.reply({ embeds: [embed] });
  }
}

export default HttpStatus;
