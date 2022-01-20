import { getAuthingGender, getContactId } from '../src';

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
});
