/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
import { CharacterId } from '../models/characterId';
export interface CharacterDoc extends Document {
  name: CharacterId;
  episodes: Array<string>;
  planet: string;
}
