

HackMate - 1 client 
2 server

2.hackathon-team-finder-backend/(server)
│
├── .env                              # Environment variables
├── .env.example                      # Example env file
├── .gitignore
├── package.json
├── tsconfig.json
├── docker-compose.yml                # Docker setup for Redis, RabbitMQ
├── README.md
│
├── prisma/
│   ├── schema.prisma                 # Database schema (the one we created)
│   ├── migrations/                   # Auto-generated migration files
│   │   └── 20240101000000_init/
│   │       └── migration.sql
│   └── seed.ts                       # Database seeding script
│
├── src/
│   │
│   ├── config/                       # Configuration files
│   │   ├── database.ts               # Prisma client singleton
│   │   ├── redis.ts                  # Redis client configuration
│   │   ├── rabbitmq.ts               # RabbitMQ connection
│   │   ├── clerk.ts                  # Clerk auth config
│   │   └── constants.ts              # App constants
│   │
│   ├── types/                        # TypeScript types & interfaces
│   │   ├── user.types.ts
│   │   ├── team.types.ts
│   │   ├── message.types.ts
│   │   ├── socket.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                        # Utility functions
│   │   ├── logger.ts                 # Winston logger
│   │   ├── error-handler.ts          # Custom error classes
│   │   ├── validation.ts             # Input validation helpers
│   │   ├── jwt.ts                    # JWT helper functions
│   │   └── redis-helper.ts           # Redis cache helpers
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.middleware.ts        # JWT/Clerk authentication
│   │   ├── error.middleware.ts       # Global error handler
│   │   ├── validation.middleware.ts  # Request validation
│   │   ├── rate-limit.middleware.ts  # Rate limiting
│   │   └── cors.middleware.ts        # CORS configuration
│   │
│   ├── services/                     # Microservices
│   │   │
│   │   ├── api-gateway/              # 🌐 API Gateway Service (Port 3000)
│   │   │   ├── server.ts             # Main gateway server
│   │   │   ├── routes/
│   │   │   │   ├── index.ts          # Route aggregator
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── user.routes.ts
│   │   │   │   ├── team.routes.ts
│   │   │   │   ├── message.routes.ts
│   │   │   │   └── admin.routes.ts
│   │   │   ├── middleware/
│   │   │   │   └── proxy.middleware.ts
│   │   │   └── config/
│   │   │       └── service-registry.ts  # Maps routes to services
│   │   │
│   │   ├── auth-service/             # 🔐 Authentication Service (Port 3001)
│   │   │   ├── server.ts
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── clerk-sync.service.ts
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.ts
│   │   │   ├── webhooks/
│   │   │   │   └── clerk-webhook.ts  # Clerk user sync
│   │   │   └── validators/
│   │   │       └── auth.validator.ts
│   │   │
│   │   ├── user-service/             # 👤 User Management Service (Port 3002)
│   │   │   ├── server.ts
│   │   │   ├── controllers/
│   │   │   │   ├── user.controller.ts
│   │   │   │   └── profile.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── profile.service.ts
│   │   │   │   └── search.service.ts
│   │   │   ├── routes/
│   │   │   │   ├── user.routes.ts
│   │   │   │   └── profile.routes.ts
│   │   │   ├── validators/
│   │   │   │   └── user.validator.ts
│   │   │   └── repositories/
│   │   │       └── user.repository.ts
│   │   │
│   │   ├── team-service/             # 👥 Team Management Service (Port 3003)
│   │   │   ├── server.ts
│   │   │   ├── controllers/
│   │   │   │   ├── team.controller.ts
│   │   │   │   ├── member.controller.ts
│   │   │   │   └── request.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── team.service.ts
│   │   │   │   ├── member.service.ts
│   │   │   │   ├── request.service.ts
│   │   │   │   └── invitation.service.ts
│   │   │   ├── routes/
│   │   │   │   ├── team.routes.ts
│   │   │   │   ├── member.routes.ts
│   │   │   │   └── request.routes.ts
│   │   │   ├── validators/
│   │   │   │   └── team.validator.ts
│   │   │   └── repositories/
│   │   │       ├── team.repository.ts
│   │   │       └── member.repository.ts
│   │   │
│   │   ├── matching-service/         # 🎯 AI Matching Service (Port 3004)
│   │   │   ├── server.ts
│   │   │   ├── controllers/
│   │   │   │   └── matching.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── matching.service.ts
│   │   │   │   ├── recommendation.service.ts
│   │   │   │   └── skill-matching.service.ts
│   │   │   ├── algorithms/
│   │   │   │   ├── skill-similarity.ts
│   │   │   │   ├── collaborative-filter.ts
│   │   │   │   └── scoring.ts
│   │   │   ├── routes/
│   │   │   │   └── matching.routes.ts
│   │   │   └── cache/
│   │   │       └── matching-cache.ts  # Redis caching
│   │   │
│   │   ├── chat-service/             # 💬 Real-time Chat Service (Port 3005)
│   │   │   ├── server.ts             # Socket.io server
│   │   │   ├── socket/
│   │   │   │   ├── socket.handler.ts
│   │   │   │   ├── events/
│   │   │   │   │   ├── message.events.ts
│   │   │   │   │   ├── typing.events.ts
│   │   │   │   │   ├── presence.events.ts
│   │   │   │   │   └── reaction.events.ts
│   │   │   │   ├── middleware/
│   │   │   │   │   └── socket-auth.middleware.ts
│   │   │   │   └── rooms/
│   │   │   │       └── room-manager.ts
│   │   │   ├── controllers/
│   │   │   │   └── message.controller.ts  # REST API for message history
│   │   │   ├── services/
│   │   │   │   ├── message.service.ts
│   │   │   │   ├── conversation.service.ts
│   │   │   │   └── file-upload.service.ts
│   │   │   ├── routes/
│   │   │   │   └── message.routes.ts  # HTTP endpoints for history
│   │   │   └── repositories/
│   │   │       └── message.repository.ts
│   │   │
│   │   ├── notification-service/     # 🔔 Notification Service (Port 3006)
│   │   │   ├── server.ts
│   │   │   ├── consumers/
│   │   │   │   └── notification.consumer.ts  # RabbitMQ consumer
│   │   │   ├── services/
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── email.service.ts
│   │   │   │   ├── push.service.ts
│   │   │   │   └── in-app.service.ts
│   │   │   ├── templates/
│   │   │   │   ├── email/
│   │   │   │   │   ├── team-invite.html
│   │   │   │   │   ├── request-accepted.html
│   │   │   │   │   └── new-message.html
│   │   │   │   └── push/
│   │   │   │       └── notification-templates.ts
│   │   │   ├── publishers/
│   │   │   │   └── notification.publisher.ts
│   │   │   ├── routes/
│   │   │   │   └── notification.routes.ts
│   │   │   └── repositories/
│   │   │       └── notification.repository.ts
│   │   │
│   │   ├── admin-service/            # 👨‍💼 Admin Dashboard Service (Port 3007)
│   │   │   ├── server.ts
│   │   │   ├── controllers/
│   │   │   │   ├── admin.controller.ts
│   │   │   │   ├── analytics.controller.ts
│   │   │   │   └── moderation.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   ├── report.service.ts
│   │   │   │   └── user-management.service.ts
│   │   │   ├── routes/
│   │   │   │   ├── admin.routes.ts
│   │   │   │   ├── analytics.routes.ts
│   │   │   │   └── moderation.routes.ts
│   │   │   └── middleware/
│   │   │       └── admin-auth.middleware.ts
│   │   │
│   │   └── file-service/             # 📁 File Upload Service (Port 3008)
│   │       ├── server.ts
│   │       ├── controllers/
│   │       │   └── file.controller.ts
│   │       ├── services/
│   │       │   ├── upload.service.ts
│   │       │   └── storage.service.ts  # Supabase Storage
│   │       ├── routes/
│   │       │   └── file.routes.ts
│   │       ├── validators/
│   │       │   └── file.validator.ts
│   │       └── utils/
│   │           ├── file-type.ts
│   │           └── image-processing.ts
│   │
│   ├── shared/                       # Shared code across services
│   │   ├── database/
│   │   │   └── prisma-client.ts      # Shared Prisma instance
│   │   ├── cache/
│   │   │   └── redis-client.ts       # Shared Redis instance
│   │   ├── queue/
│   │   │   ├── rabbitmq-client.ts
│   │   │   ├── publishers/
│   │   │   │   └── base.publisher.ts
│   │   │   └── consumers/
│   │   │       └── base.consumer.ts
│   │   ├── errors/
│   │   │   ├── app-error.ts
│   │   │   ├── not-found.error.ts
│   │   │   ├── validation.error.ts
│   │   │   └── unauthorized.error.ts
│   │   └── constants/
│   │       ├── error-codes.ts
│   │       ├── queue-names.ts
│   │       └── cache-keys.ts
│   │
│   └── scripts/                      # Utility scripts
│       ├── seed-database.ts
│       ├── clear-cache.ts
│       ├── generate-test-data.ts
│       └── migrate-production.ts
│
├── tests/                            # Test files
│   ├── unit/
│   │   ├── services/
│   │   ├── controllers/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── team.test.ts
│   │   └── chat.test.ts
│   └── e2e/
│       └── user-flow.test.ts
│
├── logs/                             # Application logs
│   ├── error.log
│   ├── combined.log
│   └── access.log
│
└── docs/                             # Documentation
    ├── API.md                        # API documentation
    ├── ARCHITECTURE.md               # System architecture
    ├── DEPLOYMENT.md                 # Deployment guide
    └── CONTRIBUTING.md               # Contribution guidelines