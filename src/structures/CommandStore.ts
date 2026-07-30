import Store from './Store.js';
import { OWNER_ID } from '../utils/constants.js';
import CommandHandler from './CommandHandler.js';
import type { Message, TextChannel } from 'discord.js';
import type MiyakoClient from './MiyakoClient.js';
import type Command from './Command.js';

class CommandStore extends Store {
  aliases: Map<string, Command>;
  handler: CommandHandler;
  ran: number;

  constructor(client: MiyakoClient) {
    super(client, 'commands');

    this.aliases = new Map();
    this.handler = new CommandHandler(client);
    this.ran = 0;
  }

  get(name: string): Command | undefined {
    return (super.get(name) as Command | undefined) || this.aliases.get(name);
  }

  has(name: string): boolean {
    return super.has(name) || this.aliases.has(name);
  }

  set(command: Command): Command {
    super.set(command);

    for (const alias of command.aliases) {
      this.aliases.set(alias, command);
    }

    return command;
  }

  delete(name: string): boolean {
    const command = this.get(name);
    if (!command) return false;

    for (const alias of command.aliases) {
      this.aliases.delete(alias);
    }

    return super.delete(name);
  }

  clear() {
    super.clear();
    this.aliases.clear();
  }

  /**
   * Return list of usable commands in context.
   */
  usableCommands(msg: Message): Command[] {
    return ([...this.values()] as Command[]).filter(command => {
      // Skip disabled commands.
      if (!command.enabled) return false;
      // Skip owner commands.
      if (command.ownerOnly && msg.author.id !== OWNER_ID) return false;
      // Skip guild only commands.
      if (!msg.guild && command.guildOnly) return false;
      // Skip commands that the user does not have permissions to run.
      if (msg.guild && !(msg.channel as TextChannel).permissionsFor(msg.author)!.has(command.userPermissions)) return false;
      // Skip NSFW commands.
      if (command.nsfw && (msg.guild && !(msg.channel as TextChannel).nsfw)) return false;
      return true;
    });
  }
}

export default CommandStore;
