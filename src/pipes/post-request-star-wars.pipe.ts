import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from 'joi';
import { CharacterModel } from '../models/character.model';
import { CharacterId } from '../models/characterId';

export interface PostCharacterRequest {
  name: string;
  episodes: Array<string>;
  planet: string | null;
}

@Injectable()
export class PostRequestStarWarsPipe
  implements PipeTransform<PostCharacterRequest, CharacterModel>
{
  transform(
    value: PostCharacterRequest,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata: ArgumentMetadata,
  ): CharacterModel {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      episodes: Joi.array().items(Joi.string()).required(),
      planet: Joi.string().allow(null),
    });

    const { error } = schema.validate(value);

    if (error) {
      throw new BadRequestException('Validation failed');
    }

    const character: CharacterModel = {
      name: CharacterId.from(value.name),
      episodes: value.episodes,
      planet: value.planet,
    };

    return character;
  }
}
