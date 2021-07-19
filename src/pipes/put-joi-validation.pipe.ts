import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import * as Joi from 'joi';
import { PutCharacterDTO } from 'src/interfaces/update-character.dto';
@Injectable()
export class PutJoiValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): PutCharacterDTO | string {
    if (metadata.type === 'param') {
      return value;
    } else if (metadata.type === 'body') {
      const schema = Joi.object({
        episodes: Joi.array().items(Joi.string()).required(),
        planet: Joi.string().min(3).max(50).allow(null),
      });
      const { error } = schema.validate(value);
      if (error) {
        throw new BadRequestException({ message: error.details[0].message });
      }
      const character: PutCharacterDTO = {
        episodes: value.episodes,
        planet: value.planet,
      };

      return character;
    }
  }
}
