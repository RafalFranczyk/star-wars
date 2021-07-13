import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CharacterId } from '../models/CharacterId';
import { CreateCharacterRequest } from '../models/CreateCharacterRequest';
import {
  PostCharacterRequest,
  PostRequestStarWarsPipe,
} from './post-request-star-wars.pipe';

describe('PostRequestStarWarsPipe', () => {
  let transformer: PostRequestStarWarsPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostRequestStarWarsPipe],
    }).compile();

    transformer = module.get<PostRequestStarWarsPipe>(PostRequestStarWarsPipe);
  });

  it('should be defined', () => {
    expect(transformer).toBeDefined();
  });

  it('should throw error if no body', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = () => transformer.transform({}, {});
    expect(response).toThrow(BadRequestException);
  });

  it('should convert to valid Star Wars Character', () => {
    const postCharacterRequest: PostCharacterRequest = {
      name: 'Luke Skywalker',
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: null,
    };
    const createCharacterRequest: CreateCharacterRequest = {
      name: CharacterId.from(postCharacterRequest.name),
      episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'],
      planet: null,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const parsedSpaceShip = transformer.transform(postCharacterRequest, {});
    expect(parsedSpaceShip).toEqual(createCharacterRequest);
  });
});
