import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StarwarsModule } from './starwars/starwars.module';
import { StarwarsController } from './starwars/starwars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { RequestMethod } from '@nestjs/common';
import { GetMiddleware } from './middlewares/get.middleware';

@Module({
  imports: [
    StarwarsModule,
    MongooseModule.forRoot('mongodb://localhost/starwars'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(StarwarsController);
    consumer
      .apply(GetMiddleware)
      .forRoutes({ path: 'starwars', method: RequestMethod.GET });
  }
}
