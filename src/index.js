import 'dotenv/config';
import MiyakoClient from './structures/MiyakoClient.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const client = new MiyakoClient(fileURLToPath(dirname(import.meta.url)));
client.login();
