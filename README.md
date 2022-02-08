# wechaty-authing

[![npm](https://img.shields.io/npm/v/wechaty-authing.svg)](https://npmjs.org/package/wechaty-authing) [![npm](https://img.shields.io/npm/dt/wechaty-authing.svg)](https://npmjs.org/package/wechaty-authing) [![Maintainability](https://api.codeclimate.com/v1/badges/3e8c3f891b4a3adcb80d/maintainability)](https://codeclimate.com/github/Authing/wechaty-authing/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/3e8c3f891b4a3adcb80d/test_coverage)](https://codeclimate.com/github/Authing/wechaty-authing/test_coverage)

[简体中文](./README.zh.md)

- [wechaty-authing](#wechaty-authing)
  - [Usage](#usage)
    - [Constructor](#constructor)
    - [protected client](#protected-client)
    - [protected createAuthingUser(contact: Contact): Promise<User | null>;](#protected-createauthingusercontact-contact-promiseuser--null)
    - [getPoolName(): Promise<string>;](#getpoolname-promisestring)
    - [filterAuthingUsers(contacts: Contact[]): Promise<ContactsFilterResult<Contact>>;](#filterauthinguserscontacts-contact-promisecontactsfilterresultcontact)
    - [createAuthingUsers(contacts: Contact[]): Promise<ContactsOperationResult<Contact>>;](#createauthinguserscontacts-contact-promisecontactsoperationresultcontact)
    - [deleteAuthingUsers(contacts: Contact[]): Promise<ContactsOperationResult<Contact>>;](#deleteauthinguserscontacts-contact-promisecontactsoperationresultcontact)
    - [bindAuthingPhone(contact: Contact, phone: string): Promise<boolean>;](#bindauthingphonecontact-contact-phone-string-promiseboolean)
    - [checkPhone(phone: string): Promise<boolean>;](#checkphonephone-string-promiseboolean)
    - [bindPhoneContact(phone: string, contact: Contact): Promise<boolean>;](#bindphonecontactphone-string-contact-contact-promiseboolean)
    - [checkEmail(email: string): Promise<boolean>;](#checkemailemail-string-promiseboolean)
    - [bindEmailContact(email: string, contact: Contact): Promise<boolean>;](#bindemailcontactemail-string-contact-contact-promiseboolean)
  - [Utils](#utils)
    - [getAuthingGender: (gender: any) => string](#getauthinggender-gender-any--string)
    - [getContactId: (contact: any) => string](#getcontactid-contact-any--string)
    - [arrayDiff: <T = Contact>(arr: T[], diff: T[]) => T[]](#arraydiff-t--contactarr-t-diff-t--t)
  - [LICENSE](#license)

## Usage

POC Example: <https://github.com/Authing/wechaty-authing-poc>

### Constructor

Params: `WechatyAuthingConfig | ManagementClientOptions`

Ref docs: https://docs.authing.cn/v2/reference/sdk-for-node/

Example:

```ts
import { WechatyAuthing, type WechatyAuthingConfig } from 'wechaty-authing';

const config: WechatyAuthingConfig = {
  userPoolId: 'xxxxxxxxxx',
  secret: 'xxxxxxxxxxx'
};

const authing = WechatyAuthing(config);
```

### protected client

Returns: `ManagementClient`

Which is an Authing SDK client

### protected createAuthingUser(contact: Contact): Promise<User | null>;

Create a Authing user

Params: `Contact`

Returns: `User | null`

### getPoolName(): Promise<string>;

Get Authing User pool name

```ts
const authing = WechatyAuthing(config);
await authing.getPoolName(); // '我的企业'
```

### filterAuthingUsers(contacts: Contact[]): Promise<ContactsFilterResult<Contact>>;

Batch check users exists from Authing

Params: `Contact[]`

Returns:

```ts
type ContactsFilterResult = {
  registered: Contact[];
  unregistered: Contact[];
  fail: Contact[];
};
```

### createAuthingUsers(contacts: Contact[]): Promise<ContactsOperationResult<Contact>>;

Batch create users to Authing

Params: `Contact[]`

Returns:

```ts
type ContactsOperationResult = {
  success: Contact[];
  fail: Contact[];
};
```

### deleteAuthingUsers(contacts: Contact[]): Promise<ContactsOperationResult<Contact>>;

Batch delete users from Authing

Params and Return values are same with the create function.

### bindAuthingPhone(contact: Contact, phone: string): Promise<boolean>;

Create or update a authing user with Wechaty contact and phone

Params:

- `Contact`
- `string`

Returns: `boolean`

### checkPhone(phone: string): Promise<boolean>;

Check if user with the phone number exists in Authing

Params: `string`

Returns: `boolean`

### bindPhoneContact(phone: string, contact: Contact): Promise<boolean>;

Bind Wechaty contact to a Authing user by phone number

Params:

- `string`
- `Contact`

Returns: `boolean`

### checkEmail(email: string): Promise<boolean>;

Check if user with the email exists in Authing

Params: `string`

Returns: `boolean`

### bindEmailContact(email: string, contact: Contact): Promise<boolean>;

Bind Wechaty contact to a Authing user by email

Params:

- `string`
- `Contact`

Returns: `boolean`

## Utils

### getAuthingGender: (gender: any) => string

Convert Wechaty ContactGender to Authing Gender format

```ts
import { getAuthingGender } from 'wechaty-authing';

getAuthingGender(contact.gender()); // ContactGender.Unknown --> U
```

### getContactId: (contact: any) => string

Get Valid Contact ID

```ts
import { getContactId } from 'wechaty-authing';

getContactId(contact); // weixin or empty string
```

### arrayDiff: <T = Contact>(arr: T[], diff: T[]) => T[]

Array Set Difference

```ts
import { arrayDiff } from 'wechaty-authing';

arrayDiff([contact1, contact2, contact3], [contact2, contact3, contact4]);
// [contact1]
```

## LICENSE

Apache 2.0
