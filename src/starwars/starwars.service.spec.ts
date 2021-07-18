import { Test, TestingModule } from '@nestjs/testing';
import { StarwarsRepository } from '../repositories/starwars-repository';
import { StarwarsService } from './starwars.service';
import { getModelToken } from '@nestjs/mongoose';
import { PostCharacterDTO } from '../interfaces/post-character.dto';
import { CharacterModel } from 'src/models/character.model';
import { Model } from 'mongoose';
import { PutCharacterDTO } from 'src/interfaces/update-character.dto';
import { QueryOptions } from 'src/configs/query-options.config';

jest.mock('../repositories/starwars-repository.ts');

describe('StarwarsService', () => {
  let service: StarwarsService;
  let repository: StarwarsRepository;
  let character_model: Model<CharacterModel>;
  let QueryOptions: QueryOptions;
  const create_character_response: CharacterModel = {
    name: 'new_name',
    episodes: ['new_episode'],
    planet: 'new_planet',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StarwarsService,
        StarwarsRepository,
        { provide: getModelToken('StarWarCharacter'), useValue: {} },
      ],
    }).compile();

    service = module.get<StarwarsService>(StarwarsService);
    repository = module.get<StarwarsRepository>(StarwarsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get characters', () => {
    it('should call the repository delete', () => {
      service.getAll(QueryOptions);
      expect(repository.get).toHaveBeenCalled();
    });
  });

  describe('create character', () => {
    const create_character_request: PostCharacterDTO = {
      name: 'new_name',
      episodes: ['new_episode'],
      planet: 'new_planet',
    };

    it('should call repository post', () => {
      service.post(create_character_request);
      expect(repository.post).toHaveBeenCalled();
    });

    it('should return that the character has been created', () => {
      jest
        .spyOn(repository, 'post')
        .mockResolvedValueOnce(create_character_response);
      expect(
        repository.post(create_character_request, character_model),
      ).resolves.toEqual(create_character_response);
    });
  });

  describe('update character', () => {
    const character_name = 'Luke Skywalker';
    const putCharacterDto: PutCharacterDTO = {
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: null,
    };

    it('should call the repository put', () => {
      service.put(character_name, putCharacterDto);
      expect(repository.put).toHaveBeenCalled();
    });

    it('should return updated on true if everything was ok', async () => {
      jest
        .spyOn(repository, 'put')
        .mockReturnValueOnce(Promise.resolve(create_character_response));
      expect(
        repository.put(character_name, putCharacterDto, character_model),
      ).resolves.toMatchObject(create_character_response);
    });

    it('should return null if not found a character', async () => {
      jest.spyOn(repository, 'put').mockReturnValueOnce(Promise.resolve(null));
      expect(
        repository.put(character_name, putCharacterDto, character_model),
      ).resolves.toBeNull();
    });
  });

  describe('delete character', () => {
    it('should call the repository delete', () => {
      const character_name = 'Luke Skywalker';
      service.delete(character_name);
      expect(repository.delete).toHaveBeenCalled();
    });

    it('should return that the character has been deleted', () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValueOnce(create_character_response);

      expect(
        repository.delete('This Star Wars character exists', character_model),
      ).resolves.toMatchObject(create_character_response);
    });

    it('should return null if not found a character', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockReturnValueOnce(Promise.resolve(null));
      expect(
        repository.delete(
          'This Star Wars character not exists',
          character_model,
        ),
      ).resolves.toBeNull();
    });
  });
});
