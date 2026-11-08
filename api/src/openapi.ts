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
