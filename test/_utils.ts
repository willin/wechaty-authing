import type { Contact } from 'wechaty';
import { WechatyAuthing } from '../src';

export const client = new WechatyAuthing({
  userPoolId: process.env.AUTHING_USER_POOL_ID,
  secret: process.env.AUTHING_USER_POOL_SECRET
});

export const searchContact = (id: string, payload = false): Contact =>
  ({
    id: `$search$-${id}`,
    ...(payload
      ? {
          payload: {
            id: 'v3_xxxxx@strange'
          }
        }
      : {})
  } as Contact);

export const normalContact = (id: string, payload = false): Contact =>
  ({
    id,
    ...(payload
      ? {
          payload: {
            id
          }
        }
      : {})
  } as Contact);
