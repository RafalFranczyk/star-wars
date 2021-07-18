/* eslint-disable prettier/prettier */
import { CharacterModel } from './character.model';

export interface CharacterPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  characters: CharacterModel[];
}
