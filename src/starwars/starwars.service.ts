import { BadRequestException, Injectable } from '@nestjs/common';
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
    try {
      return this.repository.get(options, this.characterModel);
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
  async post(data: PostCharacterDTO): Promise<CharacterModel> {
    try {
      return this.repository.post(data, this.characterModel);
    } catch (error) {
      throw new BadRequestException({ created: false, message: error.message });
    }
  }
  async put(name: string, character: PutCharacterDTO) {
    try {
      const update_character = await this.repository.put(
        name,
        character,
        this.characterModel,
      );
      if (!update_character)
        throw new BadRequestException({
          message: 'Star Wars character not found',
        });

      return { updated: true };
    } catch (error) {
      throw new BadRequestException({ updated: false, message: error.message });
    }
  }

  async delete(name: string) {
    try {
      const delete_character = await this.repository.delete(
        name,
        this.characterModel,
      );
      if (!delete_character) {
        throw new BadRequestException({
          message: 'Star Wars character not found',
        });
      }

      return { deleted: true };
    } catch (error) {
      throw new BadRequestException({ deleted: false, message: error.message });
    }
  }
}
