import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): string {
    return 'Success';
  }

}
