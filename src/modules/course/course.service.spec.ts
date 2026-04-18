import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { CourseService } from './course.service';
import { Course } from './mongoose/course.schema';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getModelToken(Course.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockReturnValue({ exec: jest.fn() }),
            findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
            findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
            findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
