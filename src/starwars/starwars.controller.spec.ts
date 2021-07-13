import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCharacterRequest } from 'src/models/UpdateCharacterRequest';
import { CharacterId } from '../models/CharacterId';
import { CreateCharacterRequest } from '../models/CreateCharacterRequest';
import { StarwarsController } from './starwars.controller';
import { StarwarsService } from './starwars.service';

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
    controller.get();
    expect(service.get).toHaveBeenCalled();
  });

  it('should call the service post', () => {
    const createCharacterRequest: CreateCharacterRequest = {
      name: CharacterId.from('Luke Skywalker'),
      episodes: ['NEWHOPE', 'EMPIRE'],
      planet: null,
    };
    controller.post(createCharacterRequest);
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
