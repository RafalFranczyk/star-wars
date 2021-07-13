import { Test, TestingModule } from '@nestjs/testing';
import { StarwarsRepository } from '../repositories/starwars-repository';
import { StarwarsService } from './starwars.service';

describe('StarwarsService', () => {
  let service: StarwarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StarwarsService, StarwarsRepository],
    }).compile();

    service = module.get<StarwarsService>(StarwarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
