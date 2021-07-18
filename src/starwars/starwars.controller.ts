import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { PutCharacterDTO } from '../interfaces/update-character.dto';
import { StarwarsService } from './starwars.service';
import { PostCharacterDTO } from '../interfaces/post-character.dto';
import { QueryOptions } from '../configs/query-options.config';
import { PostJoiValidationPipe } from '../pipes/post-joi-validation.pipe';
import { PutJoiValidationPipe } from '../pipes/put-joi-validation.pipe';
import { ApiQuery } from '@nestjs/swagger';
@Controller('starwars')
export class StarwarsController {
  constructor(private service: StarwarsService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    description: 'The maximum number of characters in response',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number (pagination)',
    required: false,
    type: Number,
  })
  public getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const options: QueryOptions = {
      page: page,
      limit: limit,
    };
    return this.service.getAll(options);
  }

  @Post()
  @UsePipes(new PostJoiValidationPipe())
  public post(
    @Body()
    createCharacterRequest: PostCharacterDTO,
  ) {
    return this.service.post(createCharacterRequest);
  }

  @Put(':name')
  @UsePipes(new PutJoiValidationPipe())
  public async put(
    @Param('name') name: string,
    @Body() character: PutCharacterDTO,
  ) {
    return await this.service.put(name, character);
  }

  @Delete(':name')
  public async delete(@Param('name') characterId: string) {
    return await this.service.delete(characterId);
  }
}
