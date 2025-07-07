const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NodeLabs Test Case API',
      version: '1.0.0',
      description: 'Node.js application with Express, Socket.IO, MongoDB, Redis, and RabbitMQ',
      contact: {
        name: 'Mustafa TOKMAK',
        email: 'mustafatokmak1881@gmail.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              description: 'Email address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              description: 'User active status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update date'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Message ID'
            },
            conversationId: {
              type: 'string',
              description: 'Conversation ID'
            },
            sender: {
              type: 'string',
              description: 'Sender user ID'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            isRead: {
              type: 'boolean',
              description: 'Message read status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Message creation date'
            }
          }
        },
        Conversation: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Conversation ID'
            },
            participants: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Participant user IDs'
            },
            lastMessage: {
              type: 'string',
              description: 'Last message ID'
            },
            lastMessageAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last message date'
            },
            isActive: {
              type: 'boolean',
              description: 'Conversation active status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Conversation creation date'
            }
          }
        },
        AutoMessage: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Auto message ID'
            },
            sender: {
              type: 'string',
              description: 'Sender user ID'
            },
            recipient: {
              type: 'string',
              description: 'Recipient user ID'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            sendDate: {
              type: 'string',
              format: 'date-time',
              description: 'Scheduled send date'
            },
            isQueued: {
              type: 'boolean',
              description: 'Queued status'
            },
            isSent: {
              type: 'boolean',
              description: 'Sent status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Auto message creation date'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Messages',
        description: 'Message management endpoints'
      },
      {
        name: 'Conversations',
        description: 'Conversation management endpoints'
      },
      {
        name: 'Statistics',
        description: 'Statistics and monitoring endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './index.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs; 