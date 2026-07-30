import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import MiyakoClient from './structures/MiyakoClient.js';
import type Command from './structures/Command.js';

const { TOKEN_DEV, TOKEN, DEV, CLIENT_ID } = process.env;
const rest = new REST({ version: '10' }).setToken((DEV ? TOKEN_DEV : TOKEN) as string);
// Create a client but do not log in, just for loading commands.
const client = new MiyakoClient();

await client.load();
const body: unknown[] = [];

for (const command of client.commands.values() as IterableIterator<Command>) {
  if (!command.modes.includes('slash')) continue;
  if (!command.enabled || command.ownerOnly) continue;

  body.push(command.getSlashCommandData()!.toJSON());
}

await rest.put(Routes.applicationCommands(CLIENT_ID as string), { body });
console.log(`Successfully registered ${body.length} application commands.`);
