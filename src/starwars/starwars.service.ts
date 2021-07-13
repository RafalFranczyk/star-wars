import { Injectable } from '@nestjs/common';
import { CharacterId } from '../models/CharacterId';
import { UpdateCharacterRequest } from '../models/UpdateCharacterRequest';
import { CreateCharacterRequest } from '../models/CreateCharacterRequest';
import { StarwarsRepository } from '../repositories/starwars-repository';

@Injectable()
export class StarwarsService {
  constructor(private repository: StarwarsRepository) {}
  get() {
    return this.repository.get();
  }
  post(data: CreateCharacterRequest) {
    this.repository.post(data);
  }
  put(id: CharacterId, character: UpdateCharacterRequest) {
    this.repository.put(id, character);
  }
  delete(id: CharacterId) {
    this.repository.delete(id);
  }
}
