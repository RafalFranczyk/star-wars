import { Test, TestingModule } from '@nestjs/testing';
import { StarwarsRepository } from './starwars-repository';
import {
  closeInMongodbConnection,
  rootMongooseTestModule,
} from '../test-utils/mongo/MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { StarWarCharacterSchema } from '../schemas/starWarsCharacters.schema';
import { CharacterModel } from '../models/character.model';
import { Model } from 'mongoose';
import { PostCharacterDTO } from '../interfaces/post-character.dto';
import { CharacterPagination } from '../models/character.pagination';

jest.mock('./starwars-repository.ts');

describe('StarwarsRepository', () => {
  let repository: StarwarsRepository;
  let starWarsCharacterModel: Model<CharacterModel>;
  const name = 'new_name';
  const post_character_dto: PostCharacterDTO = {
    name: 'new_name',
    episodes: ['new_episode'],
    planet: 'new_planet',
  };
  const create_one: PostCharacterDTO = {
    name: 'new_name_one',
    episodes: ['new_episode_one'],
    planet: 'new_planet_one',
  };
  const create_two: PostCharacterDTO = {
    name: 'new_name_two',
    episodes: ['new_episode_two'],
    planet: 'new_planet_two',
  };
  const create_three: PostCharacterDTO = {
    name: 'new_name_three',
    episodes: ['new_episode_three'],
    planet: null,
  };
  const create_four: PostCharacterDTO = {
    name: 'new_name_four',
    episodes: ['new_episode_four'],
    planet: null,
  };
  const response_get_all_characters: CharacterModel[] = [
    create_one,
    create_two,
    create_three,
    create_four,
  ];

  const response_get_pagination: CharacterModel[] = [create_three, create_four];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: 'StarWarCharacter', schema: StarWarCharacterSchema },
        ]),
      ],
      providers: [StarwarsRepository],
    }).compile();

    repository = module.get<StarwarsRepository>(StarwarsRepository);
    starWarsCharacterModel = module.get<Model<CharacterModel>>(
      'StarWarCharacterModel',
    );
  });

  afterAll(async () => {
    await starWarsCharacterModel.deleteMany({});
    await closeInMongodbConnection();
  });
  afterEach(async () => {
    await starWarsCharacterModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('get characters', () => {
    beforeEach(async () => {
      await starWarsCharacterModel.create(create_one);
      await starWarsCharacterModel.create(create_two);
      await starWarsCharacterModel.create(create_three);
      await starWarsCharacterModel.create(create_four);
    });

    it('should get all characters', async () => {
      const page = null;
      const limit = null;
      const totalRecords = await starWarsCharacterModel.countDocuments();
      const totalPages = limit != null ? Math.ceil(totalRecords / limit) : 1;
      const characterDocs = await starWarsCharacterModel
        .find()
        .skip(((page ?? 1) - 1) * limit)
        .limit(limit)
        .lean(true)
        .exec();

      const characters: CharacterPagination = {
        currentPage: limit != null ? page ?? 1 : 1,
        totalPages: totalPages,
        totalRecords: totalRecords,
        characters: characterDocs.map((doc) => ({
          name: doc.name,
          planet: doc.planet,
          episodes: doc.episodes,
        })),
      };

      expect(characters).toHaveProperty('currentPage', 1);
      expect(characters).toHaveProperty('totalPages', totalPages);
      expect(characters).toHaveProperty('totalRecords', totalRecords);
      expect(characters.characters).toEqual(response_get_all_characters);
    });

    it('should get characters (pagination)', async () => {
      const page = 2;
      const limit = 2;
      const totalRecords = await starWarsCharacterModel.countDocuments();
      const totalPages = limit != null ? Math.ceil(totalRecords / limit) : 1;
      const characterDocs = await starWarsCharacterModel
        .find()
        .skip(((page ?? 1) - 1) * limit)
        .limit(limit)
        .lean(true)
        .exec();

      const characters: CharacterPagination = {
        currentPage: limit != null ? page ?? 1 : 1,
        totalPages: totalPages,
        totalRecords: totalRecords,
        characters: characterDocs.map((doc) => ({
          name: doc.name,
          planet: doc.planet,
          episodes: doc.episodes,
        })),
      };

      expect(characters).toHaveProperty('currentPage', page);
      expect(characters).toHaveProperty('totalPages', totalPages);
      expect(characters).toHaveProperty('totalRecords', totalRecords);
      expect(characters.characters).toEqual(response_get_pagination);
    });
  });

  describe('create character', () => {
    it('should create a new character', async () => {
      const retCharacter = await starWarsCharacterModel.create(
        post_character_dto,
      );
      expect(retCharacter).toMatchObject({
        name: retCharacter.name,
        episodes: retCharacter.episodes,
        planet: retCharacter.planet,
      });
    });
  });
  describe('update character', () => {
    it('should update character and return model if character exists', async () => {
      await starWarsCharacterModel.create(post_character_dto);
      const temporary: CharacterModel = {
        name: 'new_name_update',
        episodes: ['new_episode_update'],
        planet: 'new_planet_update',
      };
      await starWarsCharacterModel.findOneAndUpdate(
        {
          name: name,
        },
        temporary,
        { useFindAndModify: false },
      );
      const result = await starWarsCharacterModel
        .findOne({
          name: temporary.name,
        })
        .lean(true);

      expect(result).toHaveProperty('name', temporary.name);
      expect(result).toHaveProperty('episodes', temporary.episodes);
      expect(result).toHaveProperty('planet', temporary.planet);
    });

    it('should return null if character not exists', async () => {
      const temporary: CharacterModel = {
        name: 'new_name_update',
        episodes: ['new_episode_update'],
        planet: 'new_planet_update',
      };
      const retCharacter = await starWarsCharacterModel.findOneAndUpdate(
        {
          name: name,
        },
        temporary,
        { useFindAndModify: false },
      );
      expect(retCharacter).toBe(null);
    });
  });
  describe('delete character', () => {
    it('should delete a character and return model', async () => {
      await starWarsCharacterModel.create(post_character_dto);
      const retCharacter = await starWarsCharacterModel.findOneAndDelete({
        name: name,
      });
      expect(retCharacter).toMatchObject({
        name: retCharacter.name,
        episodes: retCharacter.episodes,
        planet: retCharacter.planet,
      });
    });

    it('should return null if character not exists', async () => {
      const retCharacter = await starWarsCharacterModel.findOneAndDelete({
        name: name,
      });
      expect(retCharacter).toBe(null);
    });
  });
});
