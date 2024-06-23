import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from 'src/config/config.service';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          isGlobal: true,
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
  ],
})
export class RedisModule {}
