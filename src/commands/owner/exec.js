import Command from '../../structures/Command.js';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);

class Exec extends Command {
  constructor(...args) {
    super(...args, {
      description: 'Executes commands on the shell.',
      ownerOnly: true,
      modes: ['text']
    });
  }

  async run(ctx) {
    const result = await execAsync(ctx.args.join(' '), { timeout: 60000 })
      .catch(error => ({ stdout: null, stderr: error }));

    const output = result.stdout ? `**\`OUTPUT\`**${'```prolog\n' + result.stdout + '```'}` : '';
    const outerr = result.stderr ? `**\`ERROR\`**${'```prolog\n' + result.stderr + '```'}` : '';

    if (output === '' && outerr === '') {
      return ctx.reply('No output returned.');
    }

    return ctx.reply([output, outerr].join('\n'));
  }
}

export default Exec;
