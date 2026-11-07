import { loadConfig } from './config.ts';
import { startServer } from './server.ts';

// Entry point: read settings from the environment and start listening.
const config = loadConfig(process.env);
await startServer(config, (line) => console.log(line));
console.log(`Listening on ${config.host}:${config.port}`);
