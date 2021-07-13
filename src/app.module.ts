import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StarwarsModule } from './starwars/starwars.module';
import { StarwarsController } from './starwars/starwars.controller';
import { StarwarsService } from './starwars/starwars.service';
import { StarwarsRepository } from './repositories/starwars-repository';

@Module({
  imports: [StarwarsModule],
  controllers: [AppController, StarwarsController],
  providers: [AppService, StarwarsService, StarwarsRepository],
})
export class AppModule {}
