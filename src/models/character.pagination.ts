/* eslint-disable prettier/prettier */
import { CharacterModel } from './character.model';

export interface CharacterPagination {
  totalPages: number;
  totalRecords: number;
  characters: CharacterModel[];
}
