# rumourcast

Post anonymously to a single Farcaster

## Development

### Frontend

1. `bun run next:dev`

### Backend

1. Set up relevant environment variables
2. `bun run api:dev`

### Docker

1. Create a `.env` file with the required environment variables
   - Copy `.env.docker.example` to `.env` and supply the missing values
2. Run `docker compose up -d` to start all services:
   - Next.js frontend on port 3000
   - API server on port 3001 
   - Redis on port 6379
   - PostgreSQL on port 5432

On first boot, run db migrations:

```
docker compose exec -it api bun db:push
```

NOTES:-
- You may need to add sudo to the docker compose command
- Your may need to substitute `docker compose` for `docker-compose` depending on your installation
