import { Injectable } from '@nestjs/common';
import { PutCharacterDTO } from '../interfaces/update-character.dto';
import { StarwarsRepository } from '../repositories/starwars-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostCharacterDTO } from '../interfaces/post-character.dto';
import { CharacterModel } from '../models/character.model';
import { QueryOptions } from '../configs/query-options.config';
import { CharacterPagination } from '../models/character.pagination';

@Injectable()
export class StarwarsService {
  constructor(
    private repository: StarwarsRepository,
    @InjectModel('StarWarCharacter')
    private readonly characterModel: Model<CharacterModel>,
  ) {}

  async getAll(options: QueryOptions): Promise<CharacterPagination> {
    const result = this.repository.get(options, this.characterModel);
    return result;
  }
  async post(data: PostCharacterDTO): Promise<CharacterModel> {
    const result = this.repository.post(data, this.characterModel);
    return result;
  }
  async put(name: string, character: PutCharacterDTO) {
    return await this.repository.put(name, character, this.characterModel);
  }
  async delete(name: string) {
    return await this.repository.delete(name, this.characterModel);
  }
}
