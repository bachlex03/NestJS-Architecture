import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from './config/config.module';
import { validate } from './config/env.validation';

@Module({
  imports: [ConfigModule.register({ envFolder: '' }, validate), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
