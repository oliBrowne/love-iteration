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
