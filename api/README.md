# Love Iteration API

The optional self-hostable server for sharing and sync. The offline app does not need it and never talks to it unless the person turns sharing on.

```sh
npm run build -w love-iteration-api   # compile to api/dist (not committed)
npm test -w love-iteration-api        # run the API tests
```

The server needs Node 22.5 or newer, because the database uses the built-in `node:sqlite` module.

Back up a database with `npm run backup -w love-iteration-api -- <database-file> <backup-file>`. The copy is opened and integrity-checked, and an existing backup file is never overwritten.
