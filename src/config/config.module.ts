import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigOptions } from './interfaces/config-options.interface';
import { CONFIG_OPTIONS, VALIDATE_FUNC } from './env.constant';

@Global()
@Module({})
export class ConfigModule {
  static register(
    options: ConfigOptions,
    validateFunc: Function,
  ): DynamicModule {
    return {
      global: true,
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        {
          provide: VALIDATE_FUNC,
          useValue: validateFunc,
        },

        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
