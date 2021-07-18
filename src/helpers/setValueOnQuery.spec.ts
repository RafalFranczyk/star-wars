/* eslint-disable prettier/prettier */
import { setValueOnQueryPageAndLimit } from './setValueOnQuery';
describe('SetValueOnQuery', () => {
  it('check that it returns the expected value', () => {
    expect(setValueOnQueryPageAndLimit('text')).toBe(null);
    expect(setValueOnQueryPageAndLimit('123')).toBe(123);
    expect(setValueOnQueryPageAndLimit(undefined)).toBe(null);
  });
});
