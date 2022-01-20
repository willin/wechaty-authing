import {
  getAuthingGender,
  getContactId,
  contactDiff,
  filterContactUsers
} from '../src';
import { userWithExternalId, normalContact } from './_utils';

describe('utils', () => {
  it('getAuthingGender', () => {
    expect(getAuthingGender(1)).toBe('F');
    expect(getAuthingGender(2)).toBe('W');
    expect(getAuthingGender(0)).toBe('U');
  });

  it('getContactId', () => {
    expect(getContactId(null)).toBe('');
    expect(getContactId(undefined)).toBe('');
    expect(getContactId({})).toBe('');
    expect(getContactId({ id: 'test' })).toBe('test');
    expect(getContactId({ id: '$search$-test' })).toBe('');
    expect(
      getContactId({ id: '$search$-test', payload: { id: 'test2' } })
    ).toBe('test2');
  });

  it('contactDiff', () => {
    expect(contactDiff([1, 2, 3], [2, 3, 4])).toEqual([1]);
  });

  it('filterContactUsers', () => {
    expect(filterContactUsers([normalContact('test-id')], [])).toEqual([]);
    expect(filterContactUsers([normalContact('test-id')], [], false)).toEqual([
      normalContact('test-id')
    ]);
    expect(
      filterContactUsers(
        [normalContact('test-id')],
        [userWithExternalId('test-id')]
      )
    ).toEqual([normalContact('test-id')]);
  });
});
