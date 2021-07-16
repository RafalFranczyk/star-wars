import { Test, TestingModule } from '@nestjs/testing';
import { PutCharacterDTO } from '../interfaces/update-character.dto';
import { StarwarsController } from './starwars.controller';
import { StarwarsService } from './starwars.service';
import { CharacterModel } from '../models/character.model';
import { PostCharacterDTO } from '../interfaces/post-character.dto';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
jest.mock('../starwars/starwars.service.ts');

describe('StarwarsController', () => {
  let controller: StarwarsController;
  let service: StarwarsService;
  const model_character: CharacterModel = {
    name: 'luke',
    planet: null,
    episodes: ['asd'],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarwarsController],
      providers: [StarwarsService],
    }).compile();

    controller = module.get<StarwarsController>(StarwarsController);
    service = module.get<StarwarsService>(StarwarsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service get', () => {
    controller.getAll({ query: { page: 1, limit: 1 } });
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should call the service post', () => {
    const characterRequest: PostCharacterDTO = {
      name: 'Luke Skywalker',
      episodes: ['NEWHOPE', 'EMPIRE'],
      planet: null,
    };
    controller.post(characterRequest);
    expect(service.post).toHaveBeenCalled();
  });

  it('should call the service put', () => {
    const characterId = 'Luke Skywalker';
    const updateCharacterRequest: PutCharacterDTO = {
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: null,
    };

    controller.put(characterId, updateCharacterRequest);
    expect(service.put).toHaveBeenCalled();
  });

  describe('delete character', () => {
    it('should call the service delete', () => {
      const deleteCharacterRequest = 'xyz';
      controller.delete(deleteCharacterRequest);
      expect(service.delete).toHaveBeenCalled();
    });

    //it('should return that it deleted a star wars character', () => {
    //  const deleteStarWarsCharacter = jest
    //    .fn()
    //    .mockResolvedValueOnce(model_character);
    //
    //  expect(controller.delete('exist star wars character')).resolves.toEqual(
    //    deleteStarWarsCharacter,
    //  );
    //});
  });
});
