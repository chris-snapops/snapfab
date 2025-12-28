// generic string utils

/**
 * Validates if a string follows the exact UUID format:
 * 8-4-4-4-12 lowercase hexadecimal characters.
 */
export const checkIfUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  return uuidRegex.test(id);
};