import { Controller } from '@nestjs/common';
import { ApiSharedService } from './api-shared.service';

@Controller('api-shared')
export class ApiSharedController {
  constructor(private apiSharedService: ApiSharedService) {}
}
