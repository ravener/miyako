import Command from '../../structures/Command.js';
import { request } from 'undici';

class Fact extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Get a random fact.',
      aliases: ['facts', 'randomfact', 'randomfacts'],
      cooldown: 3
    });
  }

  async run(ctx) {
    const { fact } = await request('https://nekos.life/api/v2/fact')
      .then(({ body }) => body.json());

    return ctx.reply(fact);
  }
}

export default Fact;
