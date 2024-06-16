import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const DB_HOST = configService.get<string>('DB_HOST');
        const DB_PORT = configService.get<number>('DB_PORT');
        const DB_NAME = configService.get<string>('DB_NAME');
        const DB_USERNAME = configService.get<string>('DB_USERNAME');
        const DB_PASSWORD = configService.get<string>('DB_PASSWORD');

        if (DB_USERNAME && DB_PASSWORD) {
          const uri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

          return {
            uri: uri,
            dbName: DB_NAME,
          };
        }

        const uri = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

        return {
          uri: uri,
          dbName: DB_NAME,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
