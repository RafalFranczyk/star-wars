import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StarwarsModule } from './starwars/starwars.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestMethod } from '@nestjs/common';
import { GetMiddleware } from './middlewares/get.middleware';
import { ConfigModule } from '@nestjs/config';
import { config } from './configs/config';
import { TimeoutInterceptor } from './interceptor/timeout.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { MongoExceptionFilter } from './filters/mongo-exception.filter';

@Module({
  imports: [
    StarwarsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GetMiddleware)
      .forRoutes({ path: 'starwars', method: RequestMethod.GET });
  }
}
