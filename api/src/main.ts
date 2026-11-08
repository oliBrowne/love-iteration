import { loadConfig } from './config.ts';
import { openDb } from './db.ts';
import { runMigrations } from './migrate.ts';
import { migrations } from './migrations.ts';
import { startServer } from './server.ts';

// Entry point: read settings from the environment and start listening.
const config = loadConfig(process.env);
const db = openDb(config.databasePath);
runMigrations(db, migrations);
await startServer(config, (line) => console.log(line), db);
console.log(`Listening on ${config.host}:${config.port}`);
