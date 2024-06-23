import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from './config/config.module';
import { validate } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './cores/database/database.module';
import { RedisModule } from './cores/database/redis.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.register({ envFolder: '' }, validate),
    UserModule,
    AuthModule,
    DatabaseModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
