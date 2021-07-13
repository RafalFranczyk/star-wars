import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CharacterId } from '../models/CharacterId';
import { UpdateCharacterRequest } from '../models/UpdateCharacterRequest';
import { CreateCharacterRequest } from '../models/CreateCharacterRequest';
import { StarwarsService } from './starwars.service';
import { PostRequestStarWarsPipe } from '../pipes/post-request-star-wars.pipe';

@Controller('starwars')
export class StarwarsController {
  constructor(private service: StarwarsService) {}

  @Get()
  public get() {
    return this.service.get();
  }

  @Post()
  public post(
    @Body(new PostRequestStarWarsPipe())
    createCharacterRequest: CreateCharacterRequest,
  ) {
    this.service.post(createCharacterRequest);
  }

  @Put(':id')
  public put(
    @Param('id') id: CharacterId,
    @Body() character: UpdateCharacterRequest,
  ) {
    this.service.put(id, character);
  }

  @Delete(':id')
  public delete(@Param('id') characterId: CharacterId) {
    this.service.delete(characterId);
  }
}
