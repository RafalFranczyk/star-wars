/* eslint-disable prettier/prettier */
import { CharacterId } from './CharacterId';
export class CreateCharacterRequest {
  name: CharacterId;
  episodes: Array<string>;
  planet: string | null;
}
