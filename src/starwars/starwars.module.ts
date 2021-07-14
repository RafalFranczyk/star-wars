import { Module } from '@nestjs/common';
import { StarwarsRepository } from 'src/repositories/starwars-repository';
import { StarwarsController } from './starwars.controller';
import { StarwarsService } from './starwars.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StarWarCharacterSchema } from '../schemas/starWarsCharacters.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'StarWarCharacter', schema: StarWarCharacterSchema },
    ]),
  ],
  controllers: [StarwarsController],
  providers: [StarwarsService, StarwarsRepository],
})
export class StarwarsModule {}
