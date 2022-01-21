import type { ManagementClientOptions, ManagementClient } from 'authing-js-sdk';

import type { Contact } from 'wechaty';

export type WechatyAuthingConfig = ManagementClientOptions;

export type ContactsOperationResult<T = Contact> = {
  success: T[];
  fail: T[];
};

export type ContactsFilterResult<T = Contact> = {
  registered: T[];
  unregistered: T[];
  fail: T[];
};

export type { ManagementClient };
