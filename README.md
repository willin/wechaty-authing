# Wechaty-Authing

wechaty-authing 主要用于 Wechaty 开发者将 Wechaty 的 Contact、Room 同步到 Authing 进行统一的管理。同步完成之后可以在 Authing 中进行更详细的配置与查看。

Wechaty - Authing 概念定义对应关系表：

| Wechaty | Authing  | 备注 |
| ------- | -------- | ---- |
| Bot     | Userpool | 租户 |
| Room    | Group    | 分组 |
| Contact | User     | 用户 |

## 快速开始

## Authing

使用 **wechaty-authing** 之前需要用户先在 Authing 注册一个用户池。并且获取到对应的 userpoolId、secret。

> [Authing 的注册地址](https://console.authing.cn/register)，具体的使用详情可以参考 [使用文档](https://docs.authing.cn/v2/guides/basics/console/)

![Authing Console 1](https://files.authing.co/authing-blog/wechaty-authing-1.png)

### Use Wechaty Plugin

安装 **wechaty-authing** 插件

```SH
npm i wechaty-authing

// or

yarn add wechaty-authing
```

```JS

import { WechatyAuthing } from 'wechaty-authing'
import Wechaty from 'wechaty'

const bot = new Wechaty()

const authingClient = new WechatyAuthing({
    userPoolId: 'xxxxxxxxxx',
    secret: 'xxxxxxxxxxx'
})

bot.use(authingClient.plugin())

```

## Auto Sync

实现自动化同步，只要用户使用了 **wechaty-authing**，并在调用 plugin 的时候传入对应的参数（具体可以参考 PluginOptions）。用户可以在正常使用 Wechaty 的服务的时，就会将其用户信同步到 Authing。

### PluginOptions

| Field Name          | Type                       | Description               | Example                       |
| ------------------- | -------------------------- | ------------------------- | ----------------------------- |
| autoSyncEventConfig | Array\<AutoSyncEventEnum\> | 自动同步事件配置          | [ AutoSyncEventEnum.Message ] |
| autoSyncRoomConfig  | AutoSyncRoomConfig         | Room 下的自动同步事件配置 |                               |
| autoSyncCallback    | CallbackConfig             | 回调链接配置              |                               |

### AutoSyncEventEnum

| Key     | Value   | Description  |
| ------- | ------- | ------------ |
| Message | message | Message 事件 |

### AutoSyncRoomConfig

| Field Name | Type                           | Description               |
| ---------- | ------------------------------ | ------------------------- |
| roomList   | Array\<string\>                | 需要监听事件的 Room Topic |
| eventList  | Array\<AutoSyncRoomEventEnum\> | Room 下发生同步的事件列表 |

### AutoSyncRoomEventEnum

| Key    | Value  | Description                   |
| ------ | ------ | ----------------------------- |
| JOIN   | join   | Wecahty Room 中的 join 事件   |
| INVITE | invite | Wecahty Room 中的 invite 事件 |
| TOPIC  | topic  | Wecahty Room 中的 topic 事件  |
| LEAVE  | leave  | Wecahty Room 中的 leave 事件  |

### CallbackConfig

| Field Name | Class  | Description                                                                                                                            |
| ---------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| url        | string | 回调链接的 URL                                                                                                                         |
| token      | string | 设置好密钥（值由开发者自定）后，Authing 将在每个请求中（HTTP Header：authorization）附带此密钥，你可以通过验证此密钥来避免一些非法操作 |

### Sync Callback

当自动同步成功后，会通过 Callback 发送一个 Post 请求。

#### 请求体

| Field Name | Type   | Description                                                                                                                                                                                                       |
| ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| actionType | string | 回调的行为标识，由三部分构成：回调事件:具体的事件:返回 Content 的实体类型比如：message 同步成功时，actionType 的内容是：event:message:contcat 在 Room Join 事同步成功时，actionType 的内容是：roomEvent:join:room |
| content    | any    | 返回的具体实体数据，实体的类型由 actionType 中的第三部分进行判断，可以参考 下表 Content 的具体实体字段                                                                                                            |

### Sync Complete

同步完成后 Contact 相关的数据可以在，**Authing 控制台 -> 用户管理 -> 用户列表** 中进行查看

![Authing Console](https://files.authing.co/authing-blog/wechaty-authing-2.png)

Room 相关的数据可以在，**Authing 控制台 -> 用户管理 -> 分组管理** 中进行查看

![Authing Console](https://files.authing.co/authing-blog/wechaty-authing-3.png)

点击查看，可以查看到用户更加详细的信息，Room 的 Topic 以及 Room 中的用户列表

![Authing Console](https://files.authing.co/authing-blog/wechaty-authing-4.png)

## Manual Action

同时我们也提供了，兼容 Wechaty 的管理方法调用，可以实现手动同步、搜索、修改等功能。

### Contact 相关

#### **syncContact**

将 Contact 同步到 Authing。如果在 Authing 已经创建了此用户，会根据 Contact 更新用户信息。如果没有创建，则根据 Contact 创建此用户。

参数定义

```JS
import { Contact } from 'wecahty'
import { User } from 'wechaty-authing'

type ActionSyncContact = (contact: Contact) => Promise<User>

使用方法
const user = await authingClint.syncContact(contact)

console.log(user)
// authing User info
// { id: '*****', username: '*****'....... }
```

#### **addContact / createContact、updateContact、removeContact、getContact**

对于 Contact 与 Authing 中对应的用户的基础操作

参数定义

```JS
import { Contact } from 'wecahty'
import { User } from 'wechaty-authing'

// addContact / createContact
type ActionAddContact = (contact: Contact) => Promise<User>
type ActionCreateContact = ActionAddContact

// updateContact
type ActionUpdateContact = (contact: Contact) => Promise<User>

// getContact
type ActionGetContact = (contact: Contact) => Promise<User>

// removeContact
type ActionRemoveContact = (contact: Contact) => Promise<boolean>

```

使用方法

```JS
import { Contact } from 'wecahty'
import { User } from 'wechaty-authing'

let user: User

await authingClint.addContact(contact)
await authingClint.createContact(contact)

user = await authingClint.updateContact(contact)
console.log(user)

user = await authingClint.getContact(contact)
console.log(user)

await authingClint.removeContact(contact)
```

#### **findContactListRoom**

查找 Contact 所在的 Room

参数定义

```JS
import { Contact } from 'wecahty'
import { User } from 'wechaty-authing'

type ActionFindContactListRoom = (contact: Contact) => Promise<Array<Group>>
```

使用方法

```JS
const groupList = await authingClint. findContactListRoom(contact)

console.log(groupList)
```

### Room 相关

#### **syncRoom**

将 Room 同步到 Authing（只是 Room 本身不包括 Room 下的 Contact），同步的规则与 syncContact 相同。

参数定义

```JS
import { Room } from 'wecahty'
import { Group } from 'wechaty-authing'

type ActionSyncRoom = (room: Room) => Promise<Group>
```

使用方法

```JS
const group = await authingClint.syncRoom(room)

console.log(group)
// authing group info
// { id: '*****', code: '*****'....... }
```

#### **roomSyncContact**

将 Room 中的所有 Contact 同步到 Authing，同步的依据以 Room 为主，同步规则与上面介绍的 Sync 方法相同

参数定义

```JS
import { Room, Contact } from 'wecahty'
import { Group } from 'wechaty-authing'

type ActionRoomSyncContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>
```

使用方法

```JS
await authingClint.roomSyncContacts(room, contactList)
```

#### **getRoom、addRoom / reateRoom、updateRoom、removeRoom**

对于 Room 相关的一些基础操作，这些操作只是限于 Room 本身。

#### **roomGetContacts**

获取 Room 下的所有用户信息

参数定义

```JS
import { Room } from 'wecahty'
import { Group } from 'wechaty-authing'

type ActionRooomGetContacts = (room: Room) => Promise<Array<User>>
```

#### **roomAddContact(s)、roomRemoveContact(s)**

新增 / 移除 Room 中的用户

参数定义

```JS
import { Contact, Room } from 'wecahty'
import { Group } from 'wechaty-authing'

type ActionRoomAddContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>
type ActionRoomAddContact = (room: Room, contact: Contact) => Promise<boolean>

type ActionRoomRemoveContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>
type ActionRoomRemoveContact = (room: Room, contact: Contact) => Promise<boolean>
```
