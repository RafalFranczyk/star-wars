/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

export class ResponseInfo {
  @ApiProperty()
  message: string;
}

export class ErrorResponse {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  timestamp: Date;
  @ApiProperty()
  path: string;
  @ApiProperty()
  method: string;
  @ApiProperty()
  response: ResponseInfo;
}

export class SuccessDeleteResponse {
  @ApiProperty()
  deleted: boolean;
}

export class SuccessUpdateResponse {
  @ApiProperty()
  updated: boolean;
}

export class SuccessCreateResponse {
  @ApiProperty()
  name: string;
  @ApiProperty()
  episodes: Array<string>;
  @ApiProperty()
  planet?: string;
}

export class CharactersInfo {
  @ApiProperty()
  name: string;
  @ApiProperty()
  planet: Array<string>;
  @ApiProperty({ required: false })
  episodes?: string;
}
export class SuccessGetResponse {
  @ApiProperty()
  currentPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  totalRecords: number;
  @ApiProperty({ type: [CharactersInfo] })
  characters: CharactersInfo[];
}
