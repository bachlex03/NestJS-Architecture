import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swaggerConfigurations(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Architecture API')
    .setDescription('The NestJS Architecture API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const apiDocumentationCredentials = {
    name: 'admin',
    pass: 'admin',
  };

  const httpAdapter = app.getHttpAdapter();

  httpAdapter.use('/api-docs', (req, res, next) => {
    function parseAuthHeader(input: string): { name: string; pass: string } {
      const [, encodedPart] = input.split(' ');

      const buff = Buffer.from(encodedPart, 'base64');

      const text = buff.toString('ascii');

      const [name, pass] = text.split(':');

      return { name, pass };
    }

    function unauthorizedResponse(): void {
      res.status(401);

      res.set('WWW-Authenticate', 'Basic');

      next();
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse();
    }

    const credentials = parseAuthHeader(req.headers.authorization);

    if (
      credentials?.name !== apiDocumentationCredentials.name ||
      credentials?.pass !== apiDocumentationCredentials.pass
    ) {
      return unauthorizedResponse();
    }

    next();
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
