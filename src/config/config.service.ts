import { Inject, Injectable, Logger } from '@nestjs/common';
import { ENVIRONMENT_CONSTANTS } from '../common/constants/env.constant';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfigInterface } from './interfaces/env-config.interface';
import { ConfigOptions } from './interfaces/config-options.interface';
import { CONFIG_OPTIONS, VALIDATE_FUNC } from './env.constant';
import { EnvironmentFields } from './env.type';

@Injectable()
export class ConfigService {
  private readonly _envConfig: EnvConfigInterface;

  private ENV_FILE: string;
  private ENV_PATH: string;

  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: ConfigOptions,
    @Inject(VALIDATE_FUNC) private readonly validate: Function,
  ) {
    const logger = new Logger(ConfigService.name);

    if (
      Array.from(Object.values(ENVIRONMENT_CONSTANTS)).includes(
        process.env.NODE_ENV as any,
      )
    ) {
      this.ENV_FILE = `.env.${process.env.NODE_ENV}`;
    } else {
      logger.warn(
        `Invalid NODE_ENV value. Using default value: ${ENVIRONMENT_CONSTANTS.DEVELOPMENT}`,
      );
      this.ENV_FILE = `.env.${ENVIRONMENT_CONSTANTS.DEVELOPMENT}`;
    }

    this.ENV_PATH = path.resolve(
      __dirname,
      '../../',
      this.options.envFolder,
      this.ENV_FILE,
    );

    dotenv.config({ path: this.ENV_PATH });

    this._envConfig = {
      NODE_ENV: process.env.NODE_ENV,
      ENV_FILE: this.ENV_FILE,
      ENV_PATH: this.ENV_PATH,
      ...dotenv.parse(fs.readFileSync(this.ENV_PATH)),
    };

    for (const key in this._envConfig) {
      logger.verbose(`${key}: ${this._envConfig[key]}`);
    }
  }

  public get(key: keyof EnvironmentFields): string | number {
    let envData: Record<string, any> = {
      ...this._envConfig,
    };

    const validate = this.validate(envData);

    return validate[key];
  }
}
