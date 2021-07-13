import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Home')
@Controller('Home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The message has been successfully returned.',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
