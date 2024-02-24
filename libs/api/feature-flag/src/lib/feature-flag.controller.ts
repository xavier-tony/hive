import { Controller, Get, Param } from '@nestjs/common';

@Controller('featureflags')
export class FeatureFlagController {
  @Get()
  getAllFeatureFlags() {
      return [];
  }

  @Get(':id')
  getFeatureFlag(@Param('id') id: string) {
      return id;
  }
    
    
}
