import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from 'joi';
import { PostCharacterDTO } from '../interfaces/post-character.dto';

@Injectable()
export class PostJoiValidationPipe implements PipeTransform<PostCharacterDTO> {
  transform(
    value: PostCharacterDTO,
    metadata: ArgumentMetadata,
  ): PostCharacterDTO {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      episodes: Joi.array().items(Joi.string()).required(),
      planet: Joi.string().min(3).max(50).allow(null),
    });
    const { error } = schema.validate(value);

    if (error) {
      throw new BadRequestException({ message: error.details[0].message });
    }

    const character: PostCharacterDTO = {
      name: value.name,
      episodes: value.episodes,
      planet: value.planet,
    };

    return character;
  }
}
