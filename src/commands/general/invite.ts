import Command from '../../structures/Command.js';
import { link } from '../../utils/utils.js';
import { stripIndents } from 'common-tags';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class Invite extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Invite me to your server!',
      aliases: ['inv'],
      modes: ['text']
    });
  }

  async run(ctx: CommandContext) {
    const embed = this.client.embed(this.client.user)
      .setTitle('Invite Miyako to your server')
      .setDescription(stripIndents`
        You can invite me to your server using the following link:

        • ${link('Invite Link', this.client.invite)}
        • ${link('Join Miyako Lounge', 'https://discord.gg/mDkMbEh')}
        • ${link('Upvote Miyako', 'https://top.gg/bot/397796982120382464/vote')}
        • ${link('Start on GitHub', 'https://github.com/ravener/miyako')}`);

    return ctx.reply({ embeds: [embed] });
  }
}

export default Invite;

