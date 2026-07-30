import Command from '../../structures/Command.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

class UserInfo extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Get information on a mentioned user.',
      usage: 'userinfo [@user]',
      guildOnly: true,
      aliases: ['ui', 'user'],
      options: [
        {
          name: 'user',
          description: 'The user to get information on.',
          type: 'user'
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const member = options.getMember('user') ?? ctx.member!;

    const days = Math.floor((new Date() as unknown as number - (member.user.createdAt as unknown as number)) / (1000 * 60 * 60 * 24));
    const joinedDays = Math.floor((new Date() as unknown as number - (member.joinedAt as unknown as number)) / (1000 * 60 * 60 * 24));

    const embed = this.client.embed()
      .setColor(member.displayHexColor || 0xDDADCC)
      .setThumbnail(member.user.displayAvatarURL({ size: 512 }))
      .addFields({
        name: '❯ Name',
        value: member.user.tag,
        inline: true
      })
      .addFields({
        name: '❯ ID',
        value: member.id,
        inline: true
      })
      .addFields({
        name: '❯ Discord Join Date',
        value: `${member.user.createdAt.toDateString()} (${days} days ago)`,
        inline: true
      })
      .addFields({
        name: '❯ Server Join Date',
        value: `${member.joinedAt!.toDateString()} (${joinedDays} days ago)`,
        inline: true
      })
      .addFields({
        name: '❯ Bot',
        value: member.user.bot ? 'Yes' : 'No',
        inline: true
      })
      .addFields({
        name: '❯ Highest Role',
        value: member.roles.cache.size > 1 ? member.roles.highest.name : 'None',
        inline: true
      })
      .addFields({
        name: '❯ Hoist Role',
        value: member.roles.hoist ? member.roles.hoist.name : 'None',
        inline: true
      });

    return ctx.reply({ embeds: [embed] });
  }
}

export default UserInfo;
