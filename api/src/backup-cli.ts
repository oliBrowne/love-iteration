import { backupDb } from './backup.ts';
import { openDb } from './db.ts';

// Usage: npm run backup -w love-iteration-api -- <database-file> <backup-file>
const [source, destination] = process.argv.slice(2);
if (!source || !destination) {
  console.error('Usage: backup <database-file> <backup-file>');
  process.exit(1);
}
const db = openDb(source);
try {
  backupDb(db, destination);
  console.log(`Backed up ${source} to ${destination}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  db.close();
}
