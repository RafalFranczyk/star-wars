import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CharacterId } from '../models/characterId';
import { UpdateCharacterRequest } from '../interfaces/updateCharacterRequest.interface';
import { StarwarsService } from './starwars.service';
import { CharacterDTO } from '../interfaces/character.dto';
import { QueryOptions } from '../configs/query-options.config';

@Controller('starwars')
export class StarwarsController {
  constructor(private service: StarwarsService) {}

  @Get()
  public getAll(@Req() req) {
    const options: QueryOptions = {
      page: req.query.page != null ? parseInt(req.query.page) : null,
      limit: req.query.limit != null ? parseInt(req.query.limit) : null,
    };
    return this.service.getAll(options);
  }

  @Post()
  public post(
    @Body()
    createCharacterRequest: CharacterDTO,
  ) {
    return this.service.post(createCharacterRequest);
  }

  @Put(':name')
  public put(
    @Param('name') name: CharacterId,
    @Body() character: UpdateCharacterRequest,
  ) {
    this.service.put(name, character);
  }

  @Delete(':id')
  public delete(@Param('id') characterId: CharacterId) {
    this.service.delete(characterId);
  }
}
