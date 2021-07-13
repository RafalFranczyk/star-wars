/* eslint-disable prettier/prettier */

export class CharacterId {
  public static from(character_id: string): CharacterId {
    return new CharacterId(character_id);
  }
  private static validate(id: string) {
    if (!id) {
      throw new Error('Invalid Star Wars Character ID');
    }
  }
  private readonly character_id: string;

  private constructor(code: string) {
    CharacterId.validate(code);
    this.character_id = code;
  }
  public value(): string {
    return this.character_id;
  }
}
