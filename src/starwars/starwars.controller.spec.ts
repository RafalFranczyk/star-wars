import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCharacterRequest } from '../interfaces/updateCharacterRequest.interface';
import { CharacterId } from '../models/characterId';
import { StarwarsController } from './starwars.controller';
import { StarwarsService } from './starwars.service';
import { QueryOptions } from '../configs/query-options.config';
import { CharacterModel } from '../models/character.model';
import { CharacterDTO } from '../interfaces/character.dto';
import { StarwarsRepository } from '../repositories/starwars-repository';

jest.mock('../starwars/starwars.service.ts');

describe('StarwarsController', () => {
  let controller: StarwarsController;
  let service: StarwarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarwarsController],
      providers: [StarwarsService],
    }).compile();

    controller = module.get<StarwarsController>(StarwarsController);
    service = module.get<StarwarsService>(StarwarsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service get', () => {
    controller.getAll({ query: { page: 1, limit: 1 } });
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should call the service post', () => {
    const characterRequest: CharacterDTO = {
      name: 'Luke Skywalker',
      episodes: ['NEWHOPE', 'EMPIRE'],
      planet: null,
    };
    controller.post(characterRequest);
    expect(service.post).toHaveBeenCalled();
  });

  it('should call the service put', () => {
    const characterId = CharacterId.from('Luke Skywalker');
    const updateCharacterRequest: UpdateCharacterRequest = {
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: null,
    };

    controller.put(characterId, updateCharacterRequest);
    expect(service.put).toHaveBeenCalled();
  });

  it('should call the service delete', () => {
    const deleteCharacterRequest: CharacterId = CharacterId.from('xyz');
    controller.delete(deleteCharacterRequest);
    expect(service.delete).toHaveBeenCalled();
  });
});
