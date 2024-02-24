import { Test } from '@nestjs/testing';
import { ApiSharedController } from './api-shared.controller';
import { ApiSharedService } from './api-shared.service';

describe('ApiSharedController', () => {
  let controller: ApiSharedController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiSharedService],
      controllers: [ApiSharedController],
    }).compile();

    controller = module.get(ApiSharedController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
