import { ManagementClient } from 'authing-js-sdk';
import type { User } from 'authing-js-sdk';
import type { Contact } from 'wechaty';
import type {
  WechatyAuthingConfig,
  ContactsOperationResult,
  ContactsFilterResult
} from './types';
import { WechatyAuthingError } from './error';
import { getContactId, getAuthingGender } from './utils';

export class WechatyAuthing {
  #client: ManagementClient;

  #name = '';

  /* eslint-disable no-await-in-loop */
  constructor(config: WechatyAuthingConfig) {
    this.#client = new ManagementClient(config);
  }

  protected get client(): ManagementClient {
    return this.#client;
  }

  /**
   * Get Authing User pool name
   * @returns {Promise<string>}
   */
  async getPoolName(): Promise<string> {
    if (!this.#name) {
      const { name } = await this.#client.userpool.detail();
      this.#name = name;
    }
    return this.#name;
  }

  /** ********* AS UPSTREAM ************* */
  /**
   * Batch check users exists from Authing
   * 检查是否注册为 Authing 用户
   * @param {Contact[]} contacts Wechaty Contact[]
   * @returns {ContactsFilterResult} { registered: Contact[]; unregistered: Contact[]; fail: Contact[] }
   */
  async filterAuthingUsers<T = Contact>(
    contacts: T[]
  ): Promise<ContactsFilterResult<T>> {
    const registered: T[] = [];
    const unregistered: T[] = [];
    const fail: T[] = [];
    for (let i = 0; i < contacts.length; i += 1) {
      const contact = contacts[i];
      const contactId = getContactId(contact);
      if (contactId) {
        // catch not handled
        const exists = await this.#client.users.exists({
          externalId: contactId
        });
        if (exists) {
          registered.push(contact);
        } else {
          unregistered.push(contact);
        }
      } else {
        fail.push(contact);
      }
    }
    return { registered, unregistered, fail };
  }

  /**
   * Batch create users to Authing
   * 向 Authing 用户池中批量创建用户
   * @param {Contact[]} contacts Wechaty Contact[]
   * @returns {ContactsOperationResult} {success: Contact[], fail: Contact[]}
   */
  async createAuthingUsers<T = Contact>(
    contacts: T[]
  ): Promise<ContactsOperationResult<T>> {
    const success: T[] = [];
    const fail: T[] = [];
    for (let i = 0; i < contacts.length; i += 1) {
      const contact = contacts[i];
      const result = await this.#createAuthingUser(contact);
      if (result) {
        success.push(contact);
      } else {
        fail.push(contact);
      }
    }
    return { success, fail };
  }

  /**
   * Batch delete users from Authing
   * 从 Authing 用户池中批量删除 Wechaty 用户
   * @param {Contact[]} contacts Wechaty Contact[]
   * @returns {ContactsOperationResult} {success: Contact[], fail: Contact[]}   */
  async deleteAuthingUsers<T = Contact>(
    contacts: T[]
  ): Promise<ContactsOperationResult<T>> {
    const success: T[] = [];
    const fail: T[] = [];
    for (let i = 0; i < contacts.length; i += 1) {
      const contact = contacts[i];
      const contactId = getContactId(contact);
      if (contactId) {
        try {
          const user = await this.#client.users.find({ externalId: contactId });
          await this.#client.users.delete(user.id);
          success.push(contact);
        } catch (e) {
          fail.push(contact);
        }
      } else {
        fail.push(contact);
      }
    }
    return { success, fail };
  }

  /**
   * Bind phone number to Authing user
   * 绑定手机号码到 Authing 用户
   * @param {Contact} contact
   * @param {string} phone
   * @returns {Promise<boolean>}
   */
  async bindAuthingPhone<T = Contact>(
    contact: T,
    phone: string
  ): Promise<boolean> {
    // if (!/^\d{11}$/.test(phone)) {
    //   throw new WechatyAuthingError('Invalid phone format');
    // }
    const contactId = getContactId(contact);
    if (contactId) {
      try {
        const exists = await this.#client.users.exists({
          externalId: contactId
        });
        if (exists) {
          const user = await this.#client.users.find({ externalId: contactId });
          await this.#client.users.update(user.id, {
            phone
          });
        } else {
          await this.#createAuthingUser(contact);
        }
        return true;
      } catch (e) {
        throw new WechatyAuthingError((e as Error).message);
      }
    }
    return false;
  }

  /** ********* AS DOWNSTREAM ************* */
  /**
   * Check if user with the phone number exists in Authing
   * 检查手机号是否注册为 Authing 用户
   * @param {string} phone
   * @returns {Promise<boolean>}
   */
  checkPhone(phone: string): Promise<boolean> {
    return this.#client.users.exists({ phone });
  }

  async bindPhoneContact<T = Contact>(
    phone: string,
    contact: T
  ): Promise<boolean> {
    const contactId = getContactId(contact);
    if (contactId) {
      try {
        const { username, id } = await this.#client.users.find({ phone });
        await this.#client.users.update(id, {
          ...(username!.startsWith('user_')
            ? {
                username: contactId
              }
            : {}),
          externalId: contactId
        });
        return true;
      } catch (e) {
        return false;
      }
    }
    return false;
  }
  /** ********* PRIVATE ************* */

  /**
   * Create Authing user
   * 创建 Authing 用户
   * @param {Contact} contact
   * @returns {User | null}
   */
  #createAuthingUser<T = Contact>(contact: T): Promise<User | null> {
    const contactId = getContactId(contact);
    if (contactId) {
      // eslint-disable-next-line
      const avatar: string = (contact as any).payload?.avatar;
      return this.#client.users
        .create(
          {
            nickname: (contact as any as Contact).name?.(),
            photo: avatar,
            gender: getAuthingGender((contact as any as Contact).gender?.()),
            registerSource: ['wechaty'],
            username: getContactId(contact),
            externalId: getContactId(contact)
          },
          {
            identity: {
              isSocial: true,
              userIdInIdp: contactId,
              provider: 'wechaty'
            }
          }
        )
        .catch(() => null);
    }
    return Promise.resolve(null);
  }
}
