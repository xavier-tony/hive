import { Test } from '@nestjs/testing';
import { ApiSharedService } from './api-shared.service';

describe('ApiSharedService', () => {
  let service: ApiSharedService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiSharedService],
    }).compile();

    service = module.get(ApiSharedService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
