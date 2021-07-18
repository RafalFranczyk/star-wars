/* eslint-disable prettier/prettier */
export function setValueOnQueryPageAndLimit(value: any) {
  return value != null ? (!isNaN(value) ? parseInt(value) : null) : null;
}
