// import type { Contact } from 'wechaty';
// import { ContactGender } from 'wechaty-puppet/types';

/**
 * Convert Wechaty ContactGender to Authing Gender format
 * 将 Wechaty 性别转为 Authing 格式
 * @param gender
 * @returns {string}
 */
export const getAuthingGender = (gender: any): string => {
  switch (gender as number) {
    case 1: {
      // ContactGender.Male
      return 'F';
    }
    case 2: {
      // ContactGender.Female
      return 'W';
    }
    default: {
      // ContactGender.Unknown
      return 'U';
    }
  }
};

/**
 * Get Valid Contact ID
 * 获取有效的 Contact ID
 * @param {Contact} contact
 * @returns {string} or empty string
 */
export const getContactId = (contact: any): string => {
  if (!contact || typeof contact !== 'object') {
    return '';
  }
  // eslint-disable-next-line
  const isSearch =
    // eslint-disable-next-line
    (contact.id ?? '').startsWith('$search$-') && !contact.payload?.id;
  // eslint-disable-next-line
  const isStranger = (contact.payload?.id ?? '').endsWith('@stranger');
  if (isSearch || isStranger) {
    return '';
  }
  // eslint-disable-next-line
  return contact.payload?.id ?? (contact.id || '');
};
