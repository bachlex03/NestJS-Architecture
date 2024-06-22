export type EnvironmentFields = {
  PORT: number;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;

  FRONTEND_URL: string;

  SALT_OR_ROUNDS: number;

  JWT_SECRET: string;
  JWT_AT_EXPIRES_IN: string | number;
  JWT_RT_EXPIRES_IN: string | number;

  ACCOUNT_REMOVE_IN: number;
};
