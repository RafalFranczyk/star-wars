/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class PostCharacterDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  episodes: Array<string>;
  @ApiProperty({ required: false })
  planet?: string;
}
