import { PutJoiValidationPipe } from './put-joi-validation.pipe';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

describe('PutJoiValidationPipe', () => {
  let transformer: PutJoiValidationPipe;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PutJoiValidationPipe],
    }).compile();

    transformer = module.get<PutJoiValidationPipe>(PutJoiValidationPipe);
  });
  it('should be defined', () => {
    expect(new PutJoiValidationPipe()).toBeDefined();
  });
});
