/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { CharacterModel } from '../models/character.model';
import { CharacterPagination } from '../models/character.pagination';
import { UpdateCharacterRequest } from '../interfaces/updateCharacterRequest.interface';
import { CharacterId } from '../models/characterId';
import { QueryOptions } from '../configs/query-options.config';
import { Model } from 'mongoose';
import { CharacterDTO } from '../interfaces/character.dto';
@Injectable()
export class StarwarsRepository {
  async get(
    options: QueryOptions,
    characterModel: Model<CharacterModel>,
  ): Promise<CharacterPagination> {
    const totalRecords = await characterModel.count().exec();
    const characterDocs = await characterModel
      .find()
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .exec();

    const characters: CharacterPagination = {
      totalPages:
        options.limit != null ? Math.ceil(totalRecords / options.limit) : 1,
      totalRecords: totalRecords,
      characters: characterDocs.map((doc) => ({
        name: doc.name,
        planet: doc.planet,
        episodes: doc.episodes,
      })),
    };
    return characters;
  }

  async post(data: CharacterDTO, characterModel: Model<CharacterModel>) {
    const retCharacter = await characterModel.create(data as CharacterDTO);
    return {
      name: retCharacter.name,
      episodes: retCharacter.episodes,
      planet: retCharacter.planet,
    };
  }
  async put(
    name: CharacterId,
    character: UpdateCharacterRequest,
    characterModel: Model<CharacterModel>,
  ) {
    const temporary: CharacterModel = {
      name: name,
      episodes: character.episodes,
      planet: character.planet,
    };
    await characterModel
      .findOneAndUpdate(
        {
          name: name,
        },
        temporary,
      )
      .exec();
  }
  async delete(name: CharacterId, characterModel: Model<CharacterModel>) {
    await characterModel.findOneAndDelete({ name: name }).exec();
  }
}
