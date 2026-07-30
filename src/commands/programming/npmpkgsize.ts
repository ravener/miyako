import Command from '../../structures/Command.js';
import { request } from 'undici';
import { getBytes } from '../../utils/utils.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

class NPMPkgSize extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Shows the install/publish size of a npm package.',
      usage: 'npmpkgsize express',
      aliases: ['pkgsize', 'npmsize', 'packagephobia'],
      cooldown: 5,
      options: [
        {
          name: 'package',
          description: 'The NPM package to check.',
          type: 'string',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const name = options.getString('package');
    const { publishSize, installSize } = await request(`https://packagephobia.com/api.json?p=${encodeURIComponent(name)}`)
      .then(({ body }) => body.json() as Promise<{ publishSize: number; installSize: number }>);

    if (!publishSize && !installSize) {
      return ctx.reply('That package doesn\'t exist.');
    }

    const embed = this.client.embed(ctx.author)
      .setTitle(`NPM Package Size - ${name}`)
      .setDescription([
        `❯ **Publish Size:** ${getBytes(publishSize)}`,
        `❯ **Install Size:** ${getBytes(installSize)}`
      ].join('\n'))
      .setFooter({
        text: 'Powered by packagephobia.com'
      });

    return ctx.reply({ embeds: [embed] });
  }
}

export default NPMPkgSize;
