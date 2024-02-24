import { Test } from '@nestjs/testing';
import { FeatureFlagController } from './feature-flag.controller';

describe('ApiFeatureFlagController', () => {
  let controller: FeatureFlagController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [FeatureFlagController],
    }).compile();

    controller = module.get(FeatureFlagController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
