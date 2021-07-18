import { PutJoiValidationPipe } from './put-joi-validation.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PutCharacterDTO } from '../interfaces/update-character.dto';

describe('PutJoiValidationPipe', () => {
  let transformer: PutJoiValidationPipe;
  const name = 'name';
  const correct_model_character: PutCharacterDTO = {
    episodes: ['episode'],
    planet: null,
  };
  const bad_model_character: PutCharacterDTO = {
    episodes: null,
    planet: null,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PutJoiValidationPipe],
    }).compile();

    transformer = module.get<PutJoiValidationPipe>(PutJoiValidationPipe);
  });
  it('should be defined', () => {
    expect(new PutJoiValidationPipe()).toBeDefined();
  });

  it('should throw error if exist problem with validation (type is param)', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = () => transformer.transform('a', { type: 'param' });
    expect(response).toThrow(BadRequestException);
  });

  it('should throw error if body not exist (type is param)', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = () => transformer.transform({}, { type: 'param' });
    expect(response).toThrow(BadRequestException);
  });

  it('should return string if (type is param)', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = transformer.transform(name, { type: 'param' });
    expect(response).toEqual(name);
  });

  it('should throw error if exist problem with validation (type is body)', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = () =>
      transformer.transform(bad_model_character, { type: 'body' });
    expect(response).toThrow(BadRequestException);
  });

  it('should throw error if body not exist (type is body)', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = () => transformer.transform({}, { type: 'body' });
    expect(response).toThrow(BadRequestException);
  });

  it('should return model if (type is body)', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = transformer.transform(correct_model_character, {
      type: 'body',
    });
    expect(response).toMatchObject(correct_model_character);
  });
});
