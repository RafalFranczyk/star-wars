import { PostJoiValidationPipe } from './post-joi-validation.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PostCharacterDTO } from 'src/interfaces/post-character.dto';
describe('PostJoiValidationPipe', () => {
  let transformer: PostJoiValidationPipe;
  const model_character: PostCharacterDTO = {
    name: 'name',
    episodes: ['episode'],
    planet: null,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostJoiValidationPipe],
    }).compile();

    transformer = module.get<PostJoiValidationPipe>(PostJoiValidationPipe);
  });

  it('should be defined', () => {
    expect(new PostJoiValidationPipe()).toBeDefined();
  });

  it('should throw error if no body', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = () => transformer.transform({}, {});
    expect(response).toThrow(BadRequestException);
  });

  it('should return if model is correct', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const response = transformer.transform(model_character, {});
    expect(response).toMatchObject(model_character);
  });
});
