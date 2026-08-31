export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface DiscordConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  guildId: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfiguration {
  port: number;
  nodeEnv: string;
  apiKey: string;
  frontendUrl: string;
  database: DatabaseConfig;
  discord: DiscordConfig;
  jwt: JwtConfig;
}

export default (): AppConfiguration => ({
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  apiKey: process.env.API_KEY ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number.parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME ?? 'tnc_app',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: process.env.DATABASE_NAME ?? 'tnc_discordgang',
    synchronize:
      process.env.DATABASE_SYNCHRONIZE !== undefined
        ? process.env.DATABASE_SYNCHRONIZE === 'true'
        : true,
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID ?? '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    redirectUri:
      process.env.DISCORD_REDIRECT_URI ??
      'http://localhost:3000/api/v1/auth/discord/callback',
    guildId: process.env.DISCORD_GUILD_ID ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'tnc-dev-secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
});
