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
  transform(value: any, metadata: ArgumentMetadata): any {
    if (metadata.type === 'param') {
      const schema = Joi.string().min(3).max(50).required();
      const { error } = schema.validate(value);
      if (error) {
        throw new BadRequestException(error.details[0].message);
      }
      return value;
    } else if (metadata.type === 'body') {
      const schema = Joi.object({
        episodes: Joi.array().items(Joi.string()).required(),
        planet: Joi.string().min(3).max(50).allow(null),
      });
      const { error } = schema.validate(value);

      if (error) {
        throw new BadRequestException(error.details[0].message);
      }

      const character: PutCharacterDTO = {
        episodes: value.episodes,
        planet: value.planet,
      };

      return character;
    }
  }
}
