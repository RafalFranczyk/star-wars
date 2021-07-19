import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorResponse,
  SuccessCreateResponse,
  SuccessDeleteResponse,
  SuccessGetResponse,
  SuccessUpdateResponse,
} from '../models/response.model';
@ApiTags('Star Wars')
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
    description: 'Page number',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    type: SuccessGetResponse,
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponse,
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
  @ApiResponse({
    status: 201,
    type: SuccessCreateResponse,
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponse,
  })
  @ApiResponse({
    status: 409,
    type: ErrorResponse,
  })
  public post(
    @Body()
    createCharacterRequest: PostCharacterDTO,
  ) {
    return this.service.post(createCharacterRequest);
  }

  @Put(':name')
  @UsePipes(new PutJoiValidationPipe())
  @ApiResponse({
    status: 200,
    type: SuccessUpdateResponse,
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponse,
  })
  public async put(
    @Param('name') name: string,
    @Body() character: PutCharacterDTO,
  ) {
    return await this.service.put(name, character);
  }

  @Delete(':name')
  @ApiResponse({
    status: 200,
    type: SuccessDeleteResponse,
  })
  @ApiResponse({
    status: 400,
    type: ErrorResponse,
  })
  public async delete(@Param('name') characterId: string) {
    return await this.service.delete(characterId);
  }
}
