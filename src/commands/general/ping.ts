import Command from '../../structures/Command.js';
import { random } from '../../utils/utils.js';
import { pingMessages } from '../../utils/responses.js';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';
import type { Message } from 'discord.js';

class Ping extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Pong! Checks Bot latency.',
      modes: ['text']
    });
  }

  async run(ctx: CommandContext) {
    const msg = await ctx.reply({
      content: 'Ping?',
      fetchReply: true
    }) as Message;

    const took = msg.createdTimestamp - ctx.createdTimestamp;

    return ctx.editReply({
      content: random(pingMessages)
        .replace(/{{ms}}/g, took as unknown as string)
        .replace(/{{user}}/g, ctx.author.username)
    });
  }
}

export default Ping;
