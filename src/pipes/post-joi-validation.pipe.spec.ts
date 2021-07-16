import { PostJoiValidationPipe } from './post-joi-validation.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
describe('PostJoiValidationPipe', () => {
  let transformer: PostJoiValidationPipe;

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
});
