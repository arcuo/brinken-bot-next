# Brinken Bot with NextJS

This is a Discord bot that reminds us about dinners, birthdays and house
meetings. It hosts both the endpoints and CRON jobs for the Discord bot and a
website to view and manage the users and dinners.

Developed by [Bemi](https://github.com/arcuo). You can contact me at
benjamin.zachariae@gmail.com.

## Hosting

### Discord application

The discord application is hosted on
[Discord Developer Portal](https://discord.com/developers/applications/1358796040605532191/information).
Owned by the `brinkenadminkonto` discord account. You can find access to the
account in
[Brinken Indflytter Guide](https://docs.google.com/document/d/1pVYvivttl5awFSU2ha6KtNyPEXF5Ws4zETgb1r0M3OE/edit?usp=sharing).

### Application and CRON (Vercel)

The application website and endpoints are fully hosted on
[Vercel](https://vercel.com/benjamins-projects-c6d527c3/brinken-bot-next) The
current vercel application is owned by [Bemi](https://github.com/arcuo).

#### Cron

Vercel handles the daily cron job and the cron is edited via
[vercel.json](vercel.json).

### Security and user (Clerk)

The website is secured using Clerk which handles the authentication and
authorization through the Vercel [middleware.ts](./src/middleware.ts).

The Discord bot handles security itself using the DISCORD_PUBLIC_KEY and
DISCORD_BOT_TOKEN environment variables. Check out [env.ts](./src/env.ts) for
more information.

The current clerk application is owned by [Bemi](https://github.com/arcuo).

### Database

The client uses `drizzle-orm` to interact with the database. Current setup is
using a PostgreSQL database through [Neon](https://neon.tech/).

The current neon application is owned by [Bemi](https://github.com/arcuo).

## Development

### Environment variables

To run the bot locally you need to first set the environment variables in the
`.env` file. You can make a copy of the [example.env](./example.env) file and
rename it to `.env` to get started.

- Discord variables are found at
  [Discord Developer Portal](https://discord.com/developers/applications/1358796040605532191/information)
- Clerk variables are found at [Clerk](https://dashboard.clerk.com) (need
  [Bemi](https://github.com/arcuo) login)
- Neon database url is found at [Neon](https://neon.tech/) (need
  [Bemi](https://github.com/arcuo) login)
- `CRON_SECRET` is a secret key set in the Vercel dashboard. You can generate
  one using a password generator etc.
