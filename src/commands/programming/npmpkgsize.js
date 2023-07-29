import Command from '../../structures/Command.js';
import { request } from 'undici';
import { getBytes } from '../../utils/utils.js';

class NPMPkgSize extends Command {
  constructor(...args) {
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

  async run(ctx, options) {
    const name = options.getString('package');
    const { publishSize, installSize } = await request(`https://packagephobia.com/api.json?p=${encodeURIComponent(name)}`)
      .then(({ body }) => body.json());

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
