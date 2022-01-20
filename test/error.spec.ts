import { WechatyAuthingError } from '../src';

describe('WechatyAuthingError', () => {
  it('WechatyAuthingError', () => {
    const err = new WechatyAuthingError('test');
    expect(err.message).toBe('[wechaty-authing]: test');
  });
});
