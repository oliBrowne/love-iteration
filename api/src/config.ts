export type Config = { sessionSecret: string; port: number };

// Reads server settings from environment variables and checks them all at
// once, so a person fixing a bad setup sees every problem in one message.
export function loadConfig(env: Record<string, string | undefined>): Config {
  const problems: string[] = [];

  const sessionSecret = env.LOVE_SESSION_SECRET?.trim() ?? '';
  if (sessionSecret === '') {
    problems.push(
      'LOVE_SESSION_SECRET is missing. Set it to a long random string (at least 32 characters).',
    );
  } else if (sessionSecret.length < 32) {
    problems.push(
      'LOVE_SESSION_SECRET is too short. Use at least 32 characters.',
    );
  }

  const rawPort = env.LOVE_PORT?.trim() ?? '';
  let port = 8787;
  if (rawPort !== '') {
    port = Number(rawPort);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      problems.push(
        `LOVE_PORT must be a whole number from 1 to 65535, not "${rawPort}".`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(`Cannot start the server:\n- ${problems.join('\n- ')}`);
  }
  return { sessionSecret, port };
}
