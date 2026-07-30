import Command from '../../structures/Command.js';
import { stripIndents } from 'common-tags';
import type CommandContext from '../../structures/CommandContext.js';
import type { CommandConstructorArgs } from '../../types.js';

class Upvote extends Command {
  url: string;

  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Upvote for me!',
      aliases: ['vote'],
      modes: ['text']
    });

    this.url = 'https://top.gg/bot/397796982120382464/vote';
  }

  async run(ctx: CommandContext) {
    return ctx.reply(stripIndents`
      Upvote me here: ${this.url}

      Upvoting will help me grow and in the future will have some special perks!`);
  }
}

export default Upvote;
