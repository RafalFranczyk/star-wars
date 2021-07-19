import { MongoExceptionFilter } from './mongo-exception.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoError } from 'mongodb';
import { HttpStatus } from '@nestjs/common';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));

const mockGetRequest = jest.fn().mockReturnValue({
  url: 'example',
  method: 'POST',
});
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

describe('MongoExceptionFilter', () => {
  let service: MongoExceptionFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [MongoExceptionFilter],
    }).compile();
    service = module.get<MongoExceptionFilter>(MongoExceptionFilter);
  });

  it('should be defined', () => {
    expect(new MongoExceptionFilter()).toBeDefined();
  });

  it('Mongo exception duplicate', () => {
    service.catch(
      new MongoError({ code: 11000, message: 'DUPLICATE_KEY' }),
      mockArgumentsHost,
    );
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({
      statusCode: HttpStatus.CONFLICT,
      path: 'example',
      method: 'POST',
      response: { message: 'Conflict' },
    });
  });

  it('Mongo exception OUT_OF_DISK_SPACE', () => {
    service.catch(
      new MongoError({ code: 14031, message: 'OUT_OF_DISK_SPACE' }),
      mockArgumentsHost,
    );
    expect(mockJson).toBeCalledTimes(1);
    expect(mockJson).toBeCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      path: 'example',
      method: 'POST',
      response: { message: 'An unexpected error occurred, try again' },
    });
  });
});
