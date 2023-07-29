import Command from '../../structures/Command.js';

class MyID extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Retrieve your User ID.',
      modes: ['text']
    });
  }

  async run(ctx) {
    return ctx.reply(`Your User ID is: **${ctx.author.id}**`);
  }
}

export default MyID;
