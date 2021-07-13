import { Module } from '@nestjs/common';
import { StarwarsRepository } from 'src/repositories/starwars-repository';
import { StarwarsController } from './starwars.controller';
import { StarwarsService } from './starwars.service';

@Module({
  controllers: [StarwarsController],
  providers: [StarwarsService, StarwarsRepository],
})
export class StarwarsModule {}
