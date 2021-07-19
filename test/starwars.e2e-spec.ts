/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { StarwarsModule } from './../src/starwars/starwars.module';
import { AppModule } from '../src/app.module';
import { PostCharacterDTO } from '../src/interfaces/post-character.dto';
import { MongoExceptionFilter } from '../src/filters/mongo-exception.filter';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';
import { CharacterModel } from '../src/models/character.model';
import { Model } from 'mongoose';
import { closeInMongodbConnection } from '../src/test-utils/mongo/MongooseTestModule';
import { MongooseModule } from '@nestjs/mongoose';
import { StarWarCharacterSchema } from '../src/schemas/starWarsCharacters.schema';
import { PutCharacterDTO } from '../src/interfaces/update-character.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let starWarsCharacterModel: Model<CharacterModel>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        StarwarsModule,
        AppModule,
        MongooseModule.forFeature([
          { name: 'StarWarCharacter', schema: StarWarCharacterSchema },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    starWarsCharacterModel = moduleFixture.get<Model<CharacterModel>>(
      'StarWarCharacterModel',
    );
    app.useGlobalFilters(new HttpExceptionFilter(), new MongoExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await starWarsCharacterModel.deleteMany({});
    await closeInMongodbConnection();
  });

  describe('/starwars (Get)', () => {
    const create_one: PostCharacterDTO = {
      name: 'new_name_one',
      episodes: ['new_episode_one'],
      planet: 'new_planet_one',
    };
    const create_two: PostCharacterDTO = {
      name: 'new_name_two',
      episodes: ['new_episode_two'],
      planet: 'new_planet_two',
    };
    const create_three: PostCharacterDTO = {
      name: 'new_name_three',
      episodes: ['new_episode_three'],
      planet: null,
    };
    const create_four: PostCharacterDTO = {
      name: 'new_name_four',
      episodes: ['new_episode_four'],
      planet: null,
    };
    const all_characters: PostCharacterDTO[] = [
      create_one,
      create_two,
      create_three,
      create_four,
    ];
    const pagination_characters: PostCharacterDTO[] = [create_one, create_two];
    beforeEach(async () => {
      await starWarsCharacterModel.deleteMany({});

      await request(app.getHttpServer())
        .post('/starwars')
        .send(create_one)
        .expect(201);
      await request(app.getHttpServer())
        .post('/starwars')
        .send(create_two)
        .expect(201);
      await request(app.getHttpServer())
        .post('/starwars')
        .send(create_three)
        .expect(201);
      await request(app.getHttpServer())
        .post('/starwars')
        .send(create_four)
        .expect(201);
    });

    it('/starwars get all characters without page and limit', async () => {
      const limit = null;
      const page = null;
      return await request(app.getHttpServer())
        .get('/starwars')
        .expect({
          currentPage: limit != null ? page ?? 1 : 1,
          totalPages:
            limit != null ? Math.ceil(all_characters.length / limit) : 1,
          totalRecords: all_characters.length,
          characters: all_characters.map((doc) => ({
            name: doc.name,
            planet: doc.planet,
            episodes: doc.episodes,
          })),
        });
    });

    it('/starwars get all characters with set page and limit', async () => {
      const limit = 2;
      const page = 1;
      return await request(app.getHttpServer())
        .get('/starwars')
        .query({ page: page, limit: limit })
        .expect({
          currentPage: limit != null ? page ?? 1 : 1,
          totalPages:
            limit != null ? Math.ceil(all_characters.length / limit) : 1,
          totalRecords: all_characters.length,
          characters: pagination_characters.map((doc) => ({
            name: doc.name,
            planet: doc.planet,
            episodes: doc.episodes,
          })),
        });
    });

    it('/starwars get all characters with invalid page and limit value', async () => {
      const limit = 'invalid_limit_value';
      const page = 'invalid_page_value';
      return await request(app.getHttpServer())
        .get('/starwars')
        .query({ page: page, limit: limit })
        .expect({
          currentPage: 1,
          totalPages: 1,
          totalRecords: all_characters.length,
          characters: all_characters.map((doc) => ({
            name: doc.name,
            planet: doc.planet,
            episodes: doc.episodes,
          })),
        });
    });

    it('/starwars return error when page and limit have negative or zero value', async () => {
      const limit = -2;
      const page = 2;
      return await request(app.getHttpServer())
        .get('/starwars')
        .query({ page: page, limit: limit })
        .expect({
          statusCode: 400,
          path: '/starwars?page=2&limit=-2',
          method: 'GET',
          response: {
            message: 'Incorrect input query values',
          },
        });
    });
  });

  describe('/starwars (POST)', () => {
    const create_character_correct_model: PostCharacterDTO = {
      name: 'xyz',
      episodes: ['episodes'],
      planet: null,
    };

    it('/starwars correct data', async () => {
      return await request(app.getHttpServer())
        .post('/starwars')
        .send(create_character_correct_model)
        .expect(201)
        .expect(create_character_correct_model);
    });

    it('/starwars already exist characters', async () => {
      return await request(app.getHttpServer())
        .post('/starwars')
        .expect(409)
        .send(create_character_correct_model)
        .expect({
          statusCode: 409,
          path: '/starwars',
          method: 'POST',
          response: {
            message: 'Conflict',
          },
        });
    });

    it('/starwars incorrect model', async () => {
      return await request(app.getHttpServer())
        .post('/starwars')
        .send({ episodes: ['episodes'] })
        .expect(400)
        .expect({
          statusCode: 400,
          path: '/starwars',
          method: 'POST',
          response: {
            message: '"name" is required',
          },
        });
    });

    it('/starwars null body', async () => {
      return await request(app.getHttpServer())
        .post('/starwars')
        .expect(400)
        .expect({
          statusCode: 400,
          path: '/starwars',
          method: 'POST',
          response: {
            message: '"name" is required',
          },
        });
    });
  });

  describe('/starwars (PUT)', () => {
    const update_character_correct_model: PutCharacterDTO = {
      episodes: ['episodes_update'],
      planet: 'new planet',
    };

    it('/starwars update with correct input data', () => {
      return request(app.getHttpServer())
        .put('/starwars/xyz')
        .send(update_character_correct_model)
        .expect(200)
        .expect({ updated: true });
    });

    it('/starwars update where character not exist', async () => {
      return request(app.getHttpServer())
        .put('/starwars/qqq')
        .expect(400)
        .send(update_character_correct_model)
        .expect({
          statusCode: 400,
          path: '/starwars/qqq',
          method: 'PUT',
          response: {
            message: 'Star Wars character not found',
          },
        });
    });

    it('/starwars update with incorrect model', async () => {
      return await request(app.getHttpServer())
        .put('/starwars/xyz')
        .send({ planet: 'NEW ONE' })
        .expect(400)
        .expect({
          statusCode: 400,
          path: '/starwars/xyz',
          method: 'PUT',
          response: {
            message: '"episodes" is required',
          },
        });
    });

    it('/starwars update with null body', async () => {
      return request(app.getHttpServer())
        .put('/starwars/xyz')
        .expect(400)
        .expect({
          statusCode: 400,
          path: '/starwars/xyz',
          method: 'PUT',
          response: {
            message: '"episodes" is required',
          },
        });
    });

    it('/starwars without param', async () => {
      return request(app.getHttpServer()).put('/starwars/').expect(404);
    });
  });

  describe('/starwars (DELETE)', () => {
    it('/starwars exist characters', async () => {
      return request(app.getHttpServer())
        .delete('/starwars/xyz')
        .expect(200)
        .expect({ deleted: true });
    });

    it('/starwars not exist character', () => {
      return request(app.getHttpServer())
        .delete('/starwars/xyz')
        .expect(400)
        .expect({
          statusCode: 400,
          path: '/starwars/xyz',
          method: 'DELETE',
          response: {
            message: 'Star Wars character not found',
          },
        });
    });

    it('/starwars without param', async () => {
      return request(app.getHttpServer()).delete('/starwars/').expect(404);
    });
  });
});
