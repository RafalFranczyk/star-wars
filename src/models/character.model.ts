/* eslint-disable prettier/prettier */
import { CharacterId } from './characterId';
export interface CharacterModel {
  name: CharacterId;
  episodes: Array<string>;
  planet: string | null;
}
