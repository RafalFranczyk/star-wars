/* eslint-disable prettier/prettier */
import { CharacterId } from '../../src/models/CharacterId';
describe('CharacterId', () => {
  it('should throw error, id is null', () => {
    const id = null;
    const characterId = () => CharacterId.from(id);
    expect(characterId).toThrow(Error);
  });

  it('should throw error, id is undefined', () => {
    const id = undefined;
    const characterId = () => CharacterId.from(id);
    expect(characterId).toThrow(Error);
  });

  it('should throw error, id is empty string', () => {
    const id = '';
    const characterId = () => CharacterId.from(id);
    expect(characterId).toThrow(Error);
  });

  it('should return true', () => {
    const id = 'Darth Vader';
    expect(CharacterId.from(id)).toBeTruthy();
  });
});
