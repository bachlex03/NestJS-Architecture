import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './http-exception.filter';
import { swaggerConfigurations } from './common/configs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');

  app.useGlobalFilters(new HttpExceptionFilter());

  // Security middleware
  // prevent common security vulnerabilities by setting HTTP headers appropriately
  app.use(helmet());

  // Compression reduce the size of the response body and increase the speed of a web app
  app.use(compression());

  app.enableCors({ origin: configService.get('FRONTEND_URL') });

  // Swagger configurations
  swaggerConfigurations(app);

  const port = configService.get('PORT') || 3000;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
