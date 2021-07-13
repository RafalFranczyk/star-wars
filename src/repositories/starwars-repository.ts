/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { UpdateCharacterRequest } from '../models/UpdateCharacterRequest';
import { CharacterId } from '../models/CharacterId';
import { CreateCharacterRequest } from '../models/CreateCharacterRequest';

@Injectable()
export class StarwarsRepository {
  get() {
    console.log('get');
  }
  post(data: CreateCharacterRequest) {
    console.log(data);
  }
  put(id: CharacterId, character: UpdateCharacterRequest) {
    console.log(id, character);
  }
  delete(id: CharacterId) {
    console.log(id);
  }
}
