import { WechatyAuthing } from '../src';

describe('extension', () => {
  it('client', async () => {
    class ExtendedWechatyAuthing extends WechatyAuthing {
      async totalUsers(): Promise<number> {
        const { totalCount } = await this.client.users.list();
        return totalCount;
      }
    }
    const client = new ExtendedWechatyAuthing({
      userPoolId: process.env.AUTHING_USER_POOL_ID,
      secret: process.env.AUTHING_USER_POOL_SECRET
    });
    const count = await client.totalUsers();
    expect(count).toBeGreaterThan(0);
  });
});
