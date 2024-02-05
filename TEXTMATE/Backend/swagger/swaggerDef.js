const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
    },
    paths: {
        '/joinRoom': {
          post: {
            summary: 'Join a chat room',
            description: `Joins a user to a chat room using Socket.io.
                          This is a custom Socket.io API endpoint, and it works differently from traditional HTTP-based APIs.`,
            operationId: 'joinRoom',
            tags: ['Socket.io'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      username: { type: 'string' },
                      room: { type: 'string' },
                    },
                    required: ['username', 'room'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Success',
              },
              '400': {
                description: 'Bad request',
              },
            },
          },
        },
        '/chatMessage': {
          post: {
            summary: 'Send a chat message',
            description: 'Emits a chat message event to the server using Socket.io. Event Name: `chatMessage`',
            operationId: 'sendChatMessage',
            tags: ['Socket.io'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string' },
                    },
                    required: ['message'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Success',
              },
              '400': {
                description: 'Bad request',
              },
            },
          },
        },
        '/typing': {
          post: {
            summary: 'Send typing status',
            description: 'Emits a typing event to the server using Socket.io. Event Name: `typing`',
            operationId: 'sendTypingStatus',
            tags: ['Socket.io'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      username: { type: 'string' },
                    },
                    required: ['username'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Success',
              },
              '400': {
                description: 'Bad request',
              },
            },
          },
        },
        '/chat': {
          post: {
            summary: 'Send a chat message',
            description: 'Emits a chat event to the server using Socket.io. Event Name: `chat`',
            operationId: 'sendChat',
            tags: ['Socket.io'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      chat: { type: 'string' },
                    },
                    required: ['chat'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Success',
              },
              '400': {
                description: 'Bad request',
              },
            },
          },
        },
        '/stream': {
          post: {
            summary: 'Stream status',
            description: 'Emits a stream event to the server using Socket.io. Event Name: `stream`',
            operationId: 'sendStreamStatus',
            tags: ['Socket.io'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      room: { type: 'string' },
                      status: { type: 'string' },
                    },
                    required: ['room', 'status'],
                  },
                },
              },
            },
            responses: {
              '200': {
                description: 'Success',
              },
              '400': {
                description: 'Bad request',
              },
            },
          },
        },
      },
  },
  apis: ['./routes/*.js','./index.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};