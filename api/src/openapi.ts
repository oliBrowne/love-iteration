import { apiVersion } from './version.ts';

// A small OpenAPI 3.0 description of the API. Add each new route here.
export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Love Iteration API',
    version: apiVersion,
    description: 'Self-hostable server for opt-in sharing.',
  },
  paths: {
    '/accounts': {
      post: {
        summary: 'Create an account.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['handle', 'password'],
                properties: {
                  handle: { type: 'string', minLength: 3, maxLength: 32 },
                  password: { type: 'string', minLength: 10, maxLength: 200 },
                  displayName: { type: 'string', minLength: 1, maxLength: 60 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description:
              'The account was created. The password is never returned.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['id', 'handle', 'displayName'],
                  properties: {
                    id: { type: 'string' },
                    handle: { type: 'string' },
                    displayName: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'The handle, password or name is not valid.' },
          '409': { description: 'That handle is already taken.' },
        },
      },
    },
    '/login': {
      post: {
        summary: 'Log in and start a session.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['handle', 'password'],
                properties: {
                  handle: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description:
              'A session was started and sent as an HttpOnly cookie (Secure in production).',
            headers: {
              'Set-Cookie': { schema: { type: 'string' } },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ok'],
                  properties: { ok: { type: 'boolean' } },
                },
              },
            },
          },
          '401': { description: 'The handle or password is not right.' },
          '429': {
            description:
              'Too many failed logins for this handle or address; retry after 15 minutes.',
          },
        },
      },
    },
    '/me': {
      get: {
        summary: 'Return the account ID of the logged-in session.',
        responses: {
          '200': {
            description: 'The session is live.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['accountId'],
                  properties: { accountId: { type: 'string' } },
                },
              },
            },
          },
          '401': { description: 'There is no live session.' },
        },
      },
    },
    '/password': {
      post: {
        summary: 'Change the password. The current password is required.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['oldPassword', 'newPassword'],
                properties: {
                  oldPassword: { type: 'string' },
                  newPassword: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'The password was changed.' },
          '400': {
            description:
              'The current password is not right, or the new one is not acceptable.',
          },
          '401': { description: 'There is no live session.' },
        },
      },
    },
    '/account': {
      delete: {
        summary:
          'Delete the account, its sessions and records. Needs the password and the phrase "delete my account".',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'confirm'],
                properties: {
                  password: { type: 'string' },
                  confirm: { type: 'string', enum: ['delete my account'] },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'The account was deleted.' },
          '400': {
            description: 'The password is wrong or the phrase was not typed.',
          },
          '401': { description: 'There is no live session.' },
        },
      },
    },
    '/spaces': {
      get: {
        summary: 'List the spaces the caller belongs to (and only those).',
        responses: {
          '200': {
            description: 'An object with a spaces list: id, name, role.',
          },
          '401': { description: 'There is no live session.' },
        },
      },
      post: {
        summary: 'Create a shared space. The caller becomes its owner.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 80 },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'The space was created: id, name, role.' },
          '400': { description: 'The name is not valid.' },
          '401': { description: 'There is no live session.' },
        },
      },
    },
    '/spaces/{id}/invites': {
      post: {
        summary:
          'Create a one-time invitation link for a space. Owner only. The link is shown once.',
        parameters: [
          {
            name: 'hours',
            in: 'query',
            required: false,
            description:
              'Hours the invite stays valid (1 to 720, default 168).',
            schema: { type: 'integer', minimum: 1, maximum: 720 },
          },
        ],
        responses: {
          '201': { description: 'The invite: id, link, expiresAt.' },
          '400': { description: 'The hours value is not valid.' },
          '401': { description: 'There is no live session.' },
          '404': {
            description: 'No such space, or the caller does not own it.',
          },
        },
      },
    },
    '/invites/accept': {
      post: {
        summary:
          'Accept an invitation. The caller becomes a member of the one space it names.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token'],
                properties: { token: { type: 'string' } },
              },
            },
          },
        },
        responses: {
          '200': { description: 'The caller joined: spaceId.' },
          '400': { description: 'No token, or the invitation has expired.' },
          '401': { description: 'There is no live session.' },
          '404': { description: 'No such invitation.' },
        },
      },
    },
    '/logout': {
      post: {
        summary: 'Log out: revoke the session in the cookie and clear it.',
        responses: {
          '200': {
            description:
              'The session is ended (also when there was none), and the cookie is cleared.',
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Report that the server is running.',
        responses: {
          '200': {
            description: 'The server is healthy.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status', 'name', 'version'],
                  properties: {
                    status: { type: 'string', enum: ['ok'] },
                    name: { type: 'string' },
                    version: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
