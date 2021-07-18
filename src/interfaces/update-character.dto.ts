/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
export class PutCharacterDTO {
  @ApiProperty()
  episodes: Array<string>;
  @ApiProperty({ required: false })
  planet?: string;
}
