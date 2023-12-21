import { Test, TestingModule } from '@nestjs/testing';
import { BookingObjectsController } from './booking-objects.controller';
import { BookingObjectsService } from './booking-objects.service';

describe('BookingObjectsController', () => {
  let controller: BookingObjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingObjectsController],
      providers: [BookingObjectsService],
    }).compile();

    controller = module.get<BookingObjectsController>(BookingObjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
