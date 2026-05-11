import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startContentWorker } from './content-pipeline/processors/content.processor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Autônoma API')
    .setDescription('The Autônoma API description')
    .setVersion('1.0')
    .addTag('content')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
  startContentWorker();
  console.log('👷 Worker running...');
}
bootstrap();
