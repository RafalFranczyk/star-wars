/* eslint-disable prettier/prettier */
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
let mongodb: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongodb = new MongoMemoryServer();
      const mongoUri = 'mongodb://localhost/test_starwars';
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongodbConnection = async () => {
  if (mongodb) await mongodb.stop();
};
