import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeatureFlagModule } from '@hive/api/feature-flag';

@Module({
  imports: [FeatureFlagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
