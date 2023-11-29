import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';
import { AppConfig, appConfig } from './common/config';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(compression());

  const options = new DocumentBuilder()
    .setTitle('Ocean API')
    .setDescription('Ocean API for Ocean music app')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const config: AppConfig = app.get(appConfig.KEY);
  if (config.apiPrefix) {
    app.setGlobalPrefix(config.apiPrefix);
  }
  const port = config.port;

  await app.listen(port);
};
bootstrap();
