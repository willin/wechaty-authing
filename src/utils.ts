import type { User } from 'authing-js-sdk';
import type { Contact } from 'wechaty';
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

/**
 * Get Diff Set of Wechaty Contacts
 * 数组差集
 * @param {T[]} arr
 * @param {T[]} diff
 * @returns {T[]}
 */
export const contactDiff = <T = Contact>(arr: T[], diff: T[]): T[] => {
  const set = new Set(diff);
  return arr.filter((ele) => !set.has(ele));
};

/**
 * Filter Authing Users / Unregistered contacts
 * 筛选 Contact 中已经注册/未注册的用户
 * @param {Contact[]} contacts
 * @param {Users[]} users
 * @returns {Contact[]}
 */
export const filterContactUsers = <T = Contact>(
  contacts: T[],
  users: User[],
  registered = true
): T[] => {
  const set = new Set(users.map((user) => user.externalId));
  return contacts.filter((ele) => {
    if (registered) {
      return getContactId(ele) && set.has(getContactId(ele));
    }
    return !getContactId(ele) || !set.has(getContactId(ele));
  });
};

// export const arrIntersectionSet = <T = any>(arr1: T[], arr2: T[]): T[] => {
//   const set1 = new Set(arr1);
//   const set2 = new Set(arr2);
//   const intersection = new Set([...set1].filter((x) => set2.has(x)));
//   return [...intersection];
// };

// export const arrUnionSet = <T = any>(arr1: T[], arr2: T[]): T[] => {
//   const set1 = new Set(arr1);
//   const set2 = new Set(arr2);
//   const union = new Set([...set1, ...set2]);
//   return [...union];
// };

// export const arrComplementarySet = <T = any>(arr1: T[], arr2: T[]): T[] => {
//   const set1 = new Set(arr1);
//   const set2 = new Set(arr2);
//   const newArr1 = [...set1].filter((ele) => !set2.has(ele));
//   const newArr2 = [...set2].filter((ele) => !set1.has(ele));
//   return [...newArr1, newArr2];
// };
