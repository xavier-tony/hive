import { Module } from '@nestjs/common';
import { FeatureFlagController } from './feature-flag.controller';

@Module({
  controllers: [FeatureFlagController],
  providers: [],
  exports: [],
})
export class FeatureFlagModule {}
