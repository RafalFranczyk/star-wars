/* eslint-disable prettier/prettier */
import { Document } from 'mongoose';
export interface CharacterDoc extends Document {
  name: string;
  episodes: Array<string>;
  planet: string;
}
