/* eslint-disable prettier/prettier */
export function setValueOnQueryPageAndLimit(value: null | string) {
  return value != null
    ? !isNaN(parseInt(value))
      ? parseInt(value)
      : null
    : null;
}
