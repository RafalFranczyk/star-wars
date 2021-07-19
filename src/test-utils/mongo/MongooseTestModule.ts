/* eslint-disable prettier/prettier */
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongodb: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongodb = new MongoMemoryServer();
      const mongoUri =
        'mongodb+srv://Admin:Admin@cluster0.x6pyw.mongodb.net/test_starwars?retryWrites=true&w=majority';
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodbConnection = async () => {
  if (mongodb) await mongodb.stop();
};
