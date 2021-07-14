import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StarwarsModule } from './starwars/starwars.module';
import { StarwarsController } from './starwars/starwars.controller';
import { StarwarsService } from './starwars/starwars.service';
import { StarwarsRepository } from './repositories/starwars-repository';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    StarwarsModule,
    MongooseModule.forRoot('mongodb://localhost/starwars'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
