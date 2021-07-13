import { Test, TestingModule } from '@nestjs/testing';
import { StarwarsRepository } from './starwars-repository';

jest.mock('./starwars-repository.ts');

describe('StarwarsRepository', () => {
  let repository: StarwarsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarwarsRepository],
    }).compile();

    repository = module.get<StarwarsRepository>(StarwarsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
