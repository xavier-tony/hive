import { Module } from '@nestjs/common';
import { ApiSharedController } from './api-shared.controller';
import { ApiSharedService } from './api-shared.service';

@Module({
  controllers: [ApiSharedController],
  providers: [ApiSharedService],
  exports: [ApiSharedService],
})
export class ApiSharedModule {}
