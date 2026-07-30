import Command from '../../structures/Command.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';
import type { ImageURLOptions } from 'discord.js';

class Avatar extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Grab someone\'s avatar.',
      aliases: ['av', 'pfp'],
      usage: 'avatar [@user]',
      options: [
        {
          name: 'user',
          description: 'The user to get the avatar of.',
          type: 'user'
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const user = options.getUser('user') ?? ctx.author;

    const embed = this.client.embed(user)
      .setTitle(`${user.username}'s avatar`)
      .setImage(user.displayAvatarURL({
        size: 2048,
        format: 'png',
        dynamic: true
      } as unknown as ImageURLOptions));

    return ctx.reply({ embeds: [embed] });
  }
}

export default Avatar;
