import { client, searchContact, normalContact } from './_utils';

describe('Wechaty Authing Real World Testing', () => {
  beforeAll(async () => {
    await client.deleteAuthingUsers([
      normalContact('test-id1'),
      normalContact('test-id2')
    ]);
  });

  it('filterAuthingUsers', async () => {
    const { registered, unregistered, fail } = await client.filterAuthingUsers([
      searchContact('test1'),
      normalContact('test2'),
      // should set your wechat id
      normalContact(process.env.WECHATY_TEST_USER || 'test-willin')
    ]);
    expect(registered.length).toBe(1);
    expect(unregistered.length).toBe(1);
    expect(fail.length).toBe(1);
  });

  it('#createAuthingUser', async () => {
    const { success, fail } = await client.createAuthingUsers([
      normalContact('test-id1'),
      normalContact('test-id1'),
      searchContact('test-id2')
    ]);
    expect(success.length).toBe(1);
    expect(fail.length).toBe(2);
  });

  it('bindAuthingPhone', async () => {
    const successBind = await client.bindAuthingPhone(
      normalContact('test-id1'),
      '13212341234'
    );
    expect(successBind).toBeTruthy();
    const successCreate = await client.bindAuthingPhone(
      normalContact('test-id2'),
      '13212341235'
    );
    expect(successCreate).toBeTruthy();
    const failInvalidId = await client.bindAuthingPhone(
      searchContact('test-id1'),
      '13211112222'
    );
    expect(failInvalidId).toBeFalsy();
  });

  it('deleteAuthingUsers', async () => {
    const { success, fail } = await client.deleteAuthingUsers([
      normalContact('test-id1'),
      normalContact('test-id2'),
      searchContact('test-id3')
    ]);
    expect(success.length).toBe(2);
    expect(fail.length).toBe(1);
  });
});
