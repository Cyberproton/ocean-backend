# Ocean Backend

![Build Status](https://github.com/cyberproton/ocean-backend/actions/workflows/build.yml/badge.svg)

The backend for the Ocean music app.
This project is implemented using <img src="https://docs.nestjs.com/assets/logo-small.svg" alt="drawing" width="16"/> [NestJS](https://nestjs.com/) and <img src="https://raw.githubusercontent.com/prisma/presskit/main/Assets/Prisma-DarkSymbol.svg" alt="drawing" width="12"/> [Prisma](https://www.prisma.io/), powered by <img src="https://bun.sh/logo.svg" alt="drawing" width="16"/> [Bun](https://bun.sh/) Javascript runtime.

## Running the app

⚠️ Make sure you have installed <img src="https://bun.sh/logo.svg" alt="drawing" width="16"/> [Bun](https://bun.sh/docs/installation).

### Local

To run the server we need this pre-requisite:

- Postgres server running with two databases: one for the application and one for the migrations (shadow database)
- The .env file with the correct values, see [.env.template](.env.template) for reference

Commands:

```bash
# development
$ bun run start:dev

# production mode
$ bun run start:prod
```
