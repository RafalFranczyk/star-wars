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
  Req,
  UsePipes,
} from '@nestjs/common';
import { PutCharacterDTO } from '../interfaces/update-character.dto';
import { StarwarsService } from './starwars.service';
import { PostCharacterDTO } from '../interfaces/post-character.dto';
import { QueryOptions } from '../configs/query-options.config';
import { PostJoiValidationPipe } from '../pipes/post-joi-validation.pipe';
import { PutJoiValidationPipe } from '../pipes/put-joi-validation.pipe';

@Controller('starwars')
export class StarwarsController {
  constructor(private service: StarwarsService) {}

  @Get()
  public getAll(@Req() req) {
    try {
      const options: QueryOptions = {
        page: req.query.page,
        limit: req.query.limit,
      };
      return this.service.getAll(options);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @UsePipes(new PostJoiValidationPipe())
  public post(
    @Body()
    createCharacterRequest: PostCharacterDTO,
  ) {
    try {
      return this.service.post(createCharacterRequest);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Put(':name')
  @UsePipes(new PutJoiValidationPipe())
  public async put(
    @Param('name') name: string,
    @Body() character: PutCharacterDTO,
  ) {
    try {
      const result = await this.service.put(name, character);
      if (!result) throw new NotFoundException('Star Wars character not found');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':name')
  public async delete(@Param('name') characterId: string) {
    try {
      const deleteModel = await this.service.delete(characterId);
      if (!deleteModel)
        throw new NotFoundException('Star Wars character not found');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
