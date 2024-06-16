import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from './config/config.module';
import { validate } from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './cores/database/database.module';

@Module({
  imports: [
    ConfigModule.register({ envFolder: '' }, validate),
    UsersModule,
    AuthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
