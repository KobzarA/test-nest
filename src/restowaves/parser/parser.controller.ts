import { Controller, Get } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Parser')
@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @ApiResponse({
    status: 200,
    description: 'Parsing finished, created # and updated #',
  })
  @ApiResponse({
    status: 501,
    description: 'Some server error description',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error description',
  })
  @ApiOperation({
    description: 'Parse data from Google Sheets',
  })
  @Get('/google-sheet')
  async parseThroughAPI() {
    return await this.parserService.parse();
  }
}
