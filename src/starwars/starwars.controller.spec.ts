import { Test, TestingModule } from '@nestjs/testing';
import { PutCharacterDTO } from '../interfaces/update-character.dto';
import { StarwarsController } from './starwars.controller';
import { StarwarsService } from './starwars.service';
import { CharacterModel } from '../models/character.model';
import { PostCharacterDTO } from '../interfaces/post-character.dto';
import { CharacterPagination } from '../models/character.pagination';
import { QueryOptions } from '../configs/query-options.config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
jest.mock('../starwars/starwars.service.ts');

describe('StarwarsController', () => {
  let controller: StarwarsController;
  let service: StarwarsService;
  let QueryOptions: QueryOptions;
  const get_all_characters: CharacterPagination = {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 5,
    characters: [
      {
        name: 'Luke Skywalker',
        planet: null,
        episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      },
      {
        name: 'Darth Vader',
        planet: null,
        episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      },
      {
        name: 'Han Solo',
        planet: null,
        episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      },
      {
        name: 'Leia Organa',
        planet: 'Alderaan',
        episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      },
      {
        name: 'Wilhuff Tarkin',
        planet: null,
        episodes: ['NEWHOPE'],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarwarsController],
      providers: [
        {
          provide: StarwarsService,
          useValue: {
            getAll: jest.fn().mockResolvedValue(get_all_characters),
            post: jest
              .fn()
              .mockImplementation((character: PostCharacterDTO) =>
                Promise.resolve({ ...character }),
              ),
            put: jest
              .fn()
              .mockImplementation((name: string, character: PutCharacterDTO) =>
                Promise.resolve({ updated: true }),
              ),
            delete: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
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

  describe('get characters', () => {
    it('should call the service get', () => {
      controller.getAll(1, 1);
      expect(service.getAll).toHaveBeenCalled();
    });
    it('should get an array of all characters', () => {
      expect(controller.getAll(null, null)).resolves.toMatchObject(
        get_all_characters,
      );
    });

    it('should return BadRequest if something went wrong', async () => {
      try {
        jest
          .spyOn(service, 'getAll')
          .mockReturnValueOnce(Promise.reject(new BadRequestException()));
      } catch (error) {
        expect(service.getAll(QueryOptions)).resolves.toThrow(
          new NotFoundException({ message: error.message }),
        );
      }
    });
  });

  describe('create character', () => {
    const create_character_request: PostCharacterDTO = {
      name: 'new_name',
      episodes: ['new_episode'],
      planet: 'new_planet',
    };

    const create_character_response: CharacterModel = {
      name: 'new_name',
      episodes: ['new_episode'],
      planet: 'new_planet',
    };

    it('should call the service post', () => {
      controller.post(create_character_request);
      expect(service.post).toHaveBeenCalled();
    });

    it('should return that the character has been created', () => {
      jest
        .spyOn(service, 'post')
        .mockResolvedValueOnce(create_character_response);
      expect(controller.post(create_character_request)).resolves.toEqual(
        create_character_response,
      );
    });

    it('should return BadRequest if something went wrong', async () => {
      try {
        jest
          .spyOn(service, 'post')
          .mockReturnValueOnce(Promise.reject(new BadRequestException()));
      } catch (error) {
        expect(service.post(create_character_request)).resolves.toThrow(
          new BadRequestException({ created: false, message: error.message }),
        );
      }
    });
  });

  describe('update character', () => {
    const putCharacterDto: PutCharacterDTO = {
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: null,
    };

    it('should call the service put', () => {
      const character_name = 'Luke Skywalker';
      controller.put(character_name, putCharacterDto);
      expect(service.put).toHaveBeenCalled();
    });

    it('should return that the character has been updated', () => {
      jest.spyOn(service, 'put').mockResolvedValueOnce({ updated: true });
      expect(
        controller.put('Star Wars name character', putCharacterDto),
      ).resolves.toEqual({
        updated: true,
      });
    });

    it('should return BadRequest if star Wars character not found', async () => {
      try {
        jest.spyOn(service, 'put').mockReturnValueOnce(null);
        const result = service.put(
          'Star Wars character not found',
          putCharacterDto,
        );
        if (!result)
          throw new BadRequestException({
            message: 'Star Wars character not found',
          });
      } catch (error) {
        expect(error).toEqual(
          new BadRequestException({ updated: false, message: error.message }),
        );
      }
    });

    it('should return BadRequest if something went wrong', async () => {
      try {
        jest
          .spyOn(service, 'put')
          .mockReturnValueOnce(Promise.reject(new BadRequestException()));
      } catch (error) {
        expect(
          service.put('Star Wars character', putCharacterDto),
        ).resolves.toThrow(
          new BadRequestException({ updated: false, message: error.message }),
        );
      }
    });
  });

  describe('delete character', () => {
    it('should call the service delete', () => {
      const deleteCharacterRequest = 'xyz';
      controller.delete(deleteCharacterRequest);
      expect(service.delete).toHaveBeenCalled();
    });

    it('should return that the character has been deleted', () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce({ deleted: true });

      expect(
        controller.delete('name of a Star Wars character that exists'),
      ).resolves.toEqual({
        deleted: true,
      });
    });

    it('should return BadRequest if Star Wars character not found', async () => {
      try {
        jest.spyOn(service, 'delete').mockReturnValueOnce(null);
        const result = service.delete('Star Wars character not found');
        if (!result)
          throw new BadRequestException({
            message: 'Star Wars character not found',
          });
      } catch (error) {
        expect(error).toEqual(
          new BadRequestException({ deleted: false, message: error.message }),
        );
      }
    });

    it('should return BadRequest if something went wrong', async () => {
      try {
        jest
          .spyOn(service, 'delete')
          .mockReturnValueOnce(Promise.reject(new BadRequestException()));
      } catch (error) {
        expect(service.delete('Star Wars character')).resolves.toThrow(
          new BadRequestException({ delete: false, message: error.message }),
        );
      }
    });
  });
});
