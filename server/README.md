### Proof of Concepts | WebSockets Server

Proof of concept server demonstrating WebSockets communication with REST API endpoints using Elysia, Drizzle ORM, and the Bun runtime.

### Prerequisites

Install Bun using Scoop (Windows):
```bash
scoop install bun
```

For other installation methods, visit [bun.sh](https://bun.sh)

### Getting Started

1. Install dependencies:
```bash
bun install
```

2. Run the development server (with hot reload):
```bash
bun run dev
```

3. Run the production server:
```bash
bun run prod
```

4. Open [http://localhost:3000](http://localhost:3000) to test the API.

5. Health check available at [http://localhost:3000/health](http://localhost:3000/health)

### Project Structure

```
.
├── src/
│   ├── entrypoint.ts              # Main server file
│   ├── bootstrap.ts               # Application bootstrap and configuration
│   ├── infrastructure/
│   │   └── database/
│   │       └── drizz.ts           # Drizzle database configuration
│   └── presentation/
│       ├── controllers/
│       │   ├── auth-controller.ts # Authentication endpoints
│       │   ├── chat-controller.ts # Chat/WebSocket endpoints
│       │   └── user-controller.ts # User management endpoints
│       └── middlewares/
│           └── logging.ts         # Request logging middleware
├── drizzle/
│   ├── migrations/                # Database migrations
│   └── models/
│       └── user-model.ts          # User data model
├── drizzle.config.ts              # Drizzle ORM configuration
├── package.json                   # Project configuration
├── tsconfig.json                  # TypeScript configuration
├── dockerfile                     # Docker configuration
└── compose.yml                    # Docker Compose configuration
```