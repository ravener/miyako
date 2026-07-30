import Command from '../../structures/Command.js';
import Store from '../../structures/Store.js';
import type CommandContext from '../../structures/CommandContext.js';
import type MiyakoClient from '../../structures/MiyakoClient.js';
import type { CommandConstructorArgs, OptionResolver } from '../../types.js';

class Load extends Command {
  constructor(...args: CommandConstructorArgs) {
    super(...args, {
      description: 'Loads all commands/events',
      ownerOnly: true,
      modes: ['text'],
      options: [
        {
          name: 'store',
          description: 'The store to reload.',
          type: 'string',
          required: true
        }
      ]
    });
  }

  async run(ctx: CommandContext, options: OptionResolver) {
    const store = this.client[options.getString('store') as keyof MiyakoClient];

    if (!(store instanceof Store)) {
      return ctx.reply('Baka! That\'s not an actual store.');
    }

    try {
      const before = store.size;
      await store.loadFiles(true);
      const after = store.size - before;
      return ctx.reply(`Successfully reloaded/loaded ${store.size} ${store.name}. ${after === 0 ? 'There was nothing new right?' : `${after} new ${store.name} were loaded.`}`);
    } catch (err: any) {
      return ctx.reply(`There was an error loading all files: \`${err.message}\``);
    }
  }
}

export default Load;
