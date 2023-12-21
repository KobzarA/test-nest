import { Test, TestingModule } from '@nestjs/testing';
import { BookingObjectsService } from './booking-objects.service';

describe('BookingObjectsService', () => {
  let service: BookingObjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingObjectsService],
    }).compile();

    service = module.get<BookingObjectsService>(BookingObjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
