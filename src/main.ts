import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  // prevent common security vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());

  // Compression reduce the size of the response body and increase the speed of a web app
  app.use(compression());

  const configService = app.get(ConfigService);

  app.enableCors({ origin: configService.get('FRONTEND_URL') });

  const port = configService.get('PORT') || 3000;

  await app.listen(port);
}
bootstrap();
