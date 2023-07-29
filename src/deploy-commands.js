import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import MiyakoClient from './structures/MiyakoClient.js';

const { TOKEN_DEV, TOKEN, DEV, CLIENT_ID } = process.env;
const rest = new REST({ version: '10' }).setToken(DEV ? TOKEN_DEV : TOKEN);
// Create a client but do not log in, just for loading commands.
const client = new MiyakoClient();

await client.load();
const body = [];

for (const command of client.commands.values()) {
  if (!command.modes.includes('slash')) continue;
  if (!command.enabled || command.ownerOnly) continue;

  body.push(command.getSlashCommandData().toJSON());
}

await rest.put(Routes.applicationCommands(CLIENT_ID), { body });
console.log(`Successfully registered ${body.length} application commands.`);
