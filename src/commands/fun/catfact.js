import Command from '../../structures/Command.js';
import { request } from 'undici';

class CatFact extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ['catfacts', 'kittenfact'],
      cooldown: 3,
      description: 'Let me tell you a misterious cat fact.',
      cost: 10
    });
  }

  async run(ctx) {
    const { fact } = await request('https://catfact.ninja/fact')
      .then(({ body }) => body.json());

    return ctx.reply(`📢 **Catfact:** *${fact}*`);
  }
}

export default CatFact;
