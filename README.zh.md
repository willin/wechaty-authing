# wechaty-authing

[![npm](https://img.shields.io/npm/v/wechaty-authing.svg)](https://npmjs.org/package/wechaty-authing) [![npm](https://img.shields.io/npm/dt/wechaty-authing.svg)](https://npmjs.org/package/wechaty-authing) [![Maintainability](https://api.codeclimate.com/v1/badges/3e8c3f891b4a3adcb80d/maintainability)](https://codeclimate.com/github/Authing/wechaty-authing/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/3e8c3f891b4a3adcb80d/test_coverage)](https://codeclimate.com/github/Authing/wechaty-authing/test_coverage)

[English](./README.md)

- [wechaty-authing](#wechaty-authing)
  - [使用](#使用)
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

## 使用

POC 示例项目: https://github.com/Authing/wechaty-authing-poc

### Constructor

参数： `WechatyAuthingConfig | ManagementClientOptions`

参考： https://docs.authing.cn/v2/reference/sdk-for-node/

示例：

```ts
import { WechatyAuthing, type WechatyAuthingConfig } from 'wechaty-authing';

const config: WechatyAuthingConfig = {
  userPoolId: 'xxxxxxxxxx',
  secret: 'xxxxxxxxxxx'
};

const authing = WechatyAuthing(config);
```

### protected client

返回： `ManagementClient`

即 Authing SDK 实例。

### protected createAuthingUser(contact: Contact): Promise<User | null>;

创建 Authing 用户

参数： `Contact`

返回值： `User | null`

### getPoolName(): Promise<string>;

获取用户池名称

```ts
const authing = WechatyAuthing(config);
await authing.getPoolName(); // '我的企业'
```

### filterAuthingUsers(contacts: Contact[]): Promise<ContactsFilterResult<Contact>>;

检查用户是否注册为 Authing 用户。

参数： `Contact[]`

返回值：

```ts
type ContactsFilterResult = {
  registered: Contact[];
  unregistered: Contact[];
  fail: Contact[];
};
```

### createAuthingUsers(contacts: Contact[]): Promise<ContactsOperationResult<Contact>>;

向 Authing 用户池中批量创建用户

参数： `Contact[]`

返回值：

```ts
type ContactsOperationResult = {
  success: Contact[];
  fail: Contact[];
};
```

### deleteAuthingUsers(contacts: Contact[]): Promise<ContactsOperationResult<Contact>>;

从 Authing 用户池中批量删除 Wechaty 用户

参数与返回值同创建用户

### bindAuthingPhone(contact: Contact, phone: string): Promise<boolean>;

绑定 Contact 和手机号码到 Authing 用户（或创建一个用户）

参数：

- `Contact`
- `string`

返回值： `boolean`

### checkPhone(phone: string): Promise<boolean>;

检查手机号是否在用户池中存在

参数： `string`

返回值： `boolean`

### bindPhoneContact(phone: string, contact: Contact): Promise<boolean>;

将 Wechaty Contact 绑定到 Authing 手机号的用户

参数：

- `string`
- `Contact`

返回值： `boolean`

### checkEmail(email: string): Promise<boolean>;

检查邮箱是否在用户池中存在

参数： `string`

返回值： `boolean`

### bindEmailContact(email: string, contact: Contact): Promise<boolean>;

将 Wechaty Contact 绑定到 Authing 邮箱的用户

参数：

- `string`
- `Contact`

返回值： `boolean`

## Utils

### getAuthingGender: (gender: any) => string

将 Wechaty 性别转换成 Authing 性别字段

```ts
import { getAuthingGender } from 'wechaty-authing';

getAuthingGender(contact.gender()); // ContactGender.Unknown --> U
```

### getContactId: (contact: any) => string

获取有效的 Contact ID

```ts
import { getContactId } from 'wechaty-authing';

getContactId(contact); // 返回 微信号，或空字符串
```

### arrayDiff: <T = Contact>(arr: T[], diff: T[]) => T[]

数组差集

```ts
import { arrayDiff } from 'wechaty-authing';

arrayDiff([contact1, contact2, contact3], [contact2, contact3, contact4]);
// [contact1]
```

## LICENSE

Apache 2.0
