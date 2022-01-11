/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ManagementClient, User } from 'authing-js-sdk';
import qs from 'query-string';
import { Contact, Message, Room, Wechaty } from 'wechaty';
import { UsersManagementClient } from 'authing-js-sdk/build/main/lib/management/UsersManagementClient';
import { GroupsManagementClient } from 'authing-js-sdk/build/main/lib/management/GroupsManagementClient';
import axios from 'axios';
import {
  ActionAddContact,
  ActionAddRoom,
  ActionCreateContact,
  ActionCreateRoom,
  ActionGetContact,
  ActionGetRoom,
  ActionRemoveContact,
  ActionRemoveRoom,
  ActionRoomAddContact,
  ActionRoomAddContacts,
  ActionRoomRemoveContact,
  ActionRoomRemoveContacts,
  ActionRoomSyncContacts,
  ActionRoomGetContacts,
  ActionSyncContact,
  ActionSyncRoom,
  ActionUpdateContact,
  ActionUpdateRoom,
  AutoSyncEvent,
  AutoSyncEventConfig,
  AutoSyncEventEnum,
  AutoSyncRoomConfig,
  AutoSyncRoomEvent,
  AutoSyncRoomEventEnum,
  CallbackConfig,
  Group,
  PluginOptions,
  WechatyAuthingOptions
} from '../type';

export class WechatyAuthing {
  /**
   * 初始化需要传入用户池 ID userPoolId 和用户池密钥 secret
   *
   * Docs: https://docs.authing.cn/v2/reference/sdk-for-node/#%E5%88%9D%E5%A7%8B%E5%8C%96-2
   */
  options: WechatyAuthingOptions;

  /**
   * ManagementClient 以管理员（Administrator）的身份进行请求
   * 用于管理用户池资源和执行管理任务，提供了管理用户、角色、应用、资源等方法
   * 一般来说，你在 Authing 控制台 (opens new window)中能做的所有操作，都能用此模块完成
   *
   * Docs: https://docs.authing.cn/v2/reference/sdk-for-node/management/
   */
  private managementClient: ManagementClient;

  private usersClient: UsersManagementClient;

  private groupsClient: GroupsManagementClient;

  private puppet: string;

  private provider: string;

  private autoSyncRoomConfig: AutoSyncRoomConfig = {
    roomList: [],
    eventList: []
  };

  private autoSyncEventConfig: AutoSyncEventConfig = [];

  private autoSyncCallbackConfig: CallbackConfig | null = null;

  constructor(options: WechatyAuthingOptions) {
    this.options = options;

    this.managementClient = new ManagementClient(options);

    this.usersClient = this.managementClient.users;
    this.groupsClient = this.managementClient.groups;

    this.puppet = 'wechaty-puppet';

    this.provider = `wechaty:${this.puppet}`;
  }

  plugin = (option?: PluginOptions) => {
    if (!option) return this.install;

    const { autoSyncRoomConfig, autoSyncEventConfig, autoSyncCallback } =
      option;

    if (autoSyncEventConfig) this.autoSyncEventConfig = autoSyncEventConfig;

    if (autoSyncRoomConfig) this.autoSyncRoomConfig = autoSyncRoomConfig;

    if (autoSyncCallback) this.autoSyncCallbackConfig = autoSyncCallback;

    return this.install;
  };

  install = (bot: Wechaty) => {
    this.puppet = bot.puppet.name() ?? 'wechaty-puppet';

    this.provider = `wechaty:${this.puppet}`;

    this.initAutoSyncEvent(bot);

    this.initAutoSyncRoom(bot);

    return bot;
  };

  getManagementClient = () => this.managementClient;

  syncContact: ActionSyncContact = async (contact: Contact) => {
    const user: User = await this.getContact(contact);

    if (user) return this.updateContact(contact);
    return this.addContact(contact);
  };

  removeContact: ActionRemoveContact = async (contact: Contact) => {
    const user: User = await this.getContact(contact);

    if (!user) return false;

    await this.usersClient.delete(user.id);

    return true;
  };

  updateContact: ActionUpdateContact = async (contact: Contact) => {
    const user: User = await this.getContact(contact);

    if (!(await this.getContact(contact)))
      throw new Error('this contact does not exist in Authing');

    const { avatar } = contact.payload;
    return this.usersClient.update(user.id, {
      username: contact.weixin(),
      nickname: contact.name(),
      phone: avatar
    });
  };

  addContact: ActionAddContact = async (contact: Contact) => {
    let user: User = await this.getContact(contact);

    if (user) return user;

    const { avatar } = contact.payload;
    const userinfo = {
      nickname: contact.name(),
      photo: avatar,
      username: contact.weixin()
    };

    user = await this.usersClient.create(userinfo, {
      identity: {
        userIdInIdp: contact.id,
        provider: this.provider
      }
    });

    return user;
  };

  createContact: ActionCreateContact = this.addContact;

  getContact: ActionGetContact = async (contact: Contact) => {
    const user = await this.usersClient.find({
      identity: {
        userIdInIdp: contact.id,
        provider: this.provider
      }
    });

    return user;
  };

  getRoom: ActionGetRoom = async (room: Room) =>
    this.groupsClient.detail(room.id);

  addRoom: ActionAddRoom = async (room: Room) => {
    let group: Group;

    group = await this.getRoom(room);

    if (group) return group;

    group = await this.groupsClient.create(room.id, await room.topic());

    return group;
  };

  createRoom: ActionCreateRoom = this.addRoom;

  updateRoom: ActionUpdateRoom = async (room: Room) => {
    let group: Group;

    group = await this.getRoom(room);

    if (!group) throw new Error('this room does not exist in Authing');

    group = await this.groupsClient.update(group.code!, {
      name: await room.topic()
    });

    return group;
  };

  removeRoom: ActionRemoveRoom = async (room: Room) => {
    const group: Group = await this.getRoom(room);

    if (!group) return false;

    await this.groupsClient.delete(group.code!);

    return true;
  };

  syncRoom: ActionSyncRoom = async (room) => {
    const group: Group = await this.getRoom(room);

    if (group) {
      return this.updateRoom(room);
    }
    return this.addRoom(room);
  };

  roomAddContacts: ActionRoomAddContacts = async (room, contactList) => {
    const group = await this.syncRoom(room);

    const resList = contactList.map((contact) => this.syncContact(contact));

    const userList = await Promise.all(resList);

    await this.groupsClient.addUsers(
      group.code!,
      userList.map((user) => user.id)
    );

    return true;
  };

  roomAddContact: ActionRoomAddContact = async (room, contact) =>
    await this.roomAddContacts(room, [contact]);

  roomRemoveContacts: ActionRoomRemoveContacts = async (room, contactList) => {
    const group = await this.syncRoom(room);

    const userList = await Promise.all(
      contactList.map((contact) => this.syncContact(contact))
    );

    await this.groupsClient.removeUsers(
      group.code!,
      userList.map((user) => user.id)
    );

    return true;
  };

  roomRemoveContact: ActionRoomRemoveContact = (room, contact) =>
    this.roomRemoveContacts(room, [contact]);

  rooomGetContacts: ActionRoomGetContacts = async (room) => {
    const group = await this.syncRoom(room);

    const userList = await this.groupsClient.listUsers(group.code!, {
      page: 1,
      limit: -1
    });

    return userList.list as User[];
  };

  roomSyncContacts: ActionRoomSyncContacts = async (room, contactList) => {
    const group: Group = await this.getRoom(room);

    if (group) {
      await this.groupsClient.delete(group.code!);
    }

    await this.roomAddContacts(room, contactList);

    return true;
  };

  private initAutoSyncEvent = async (bot: Wechaty) => {
    const eventMapping: Record<AutoSyncEventEnum, AutoSyncEvent> = {
      [AutoSyncEventEnum.Message]: this.onMessage
    };

    const onEventList = this.autoSyncEventConfig.map(
      (event) => eventMapping[event]
    );

    onEventList.forEach((event) => event(bot));
  };

  private initAutoSyncRoom = async (bot: Wechaty) => {
    const { roomList: roomTopicList, eventList } = this.autoSyncRoomConfig;

    const roomList = await Promise.all(
      roomTopicList.map((roomTopic) => bot.Room.find({ topic: roomTopic }))
    );

    roomList.filter((room) => !!room);

    const eventMapping: Record<AutoSyncRoomEventEnum, AutoSyncRoomEvent> = {
      [AutoSyncRoomEventEnum.INVITE]: this.onInvite,
      [AutoSyncRoomEventEnum.JOIN]: this.onJoin,
      [AutoSyncRoomEventEnum.LEAVE]: this.onLeave,
      [AutoSyncRoomEventEnum.TOPIC]: this.onTopic
    };

    const onEventList = eventList.map((event) => eventMapping[event]);

    roomList
      .filter((room) => !!room)
      .map((room) => onEventList.forEach((event) => event(room!)));
  };

  onMessage: AutoSyncEvent = async (bot) => {
    bot.on('message', async (message: Message) => {
      const contact = message.talker();
      const room = message.room();

      const user = await this.syncContact(contact);
      this.autoSyncCallback('event:message:contcat', user);

      if (room) {
        const group = await this.syncRoom(room);

        this.autoSyncCallback('event:message:room', group);
      }
    });
  };

  onJoin: AutoSyncRoomEvent = async (room) => {
    room.on('join', async (inviteeList) => {
      await this.roomAddContacts(room, inviteeList);

      const group = await this.getRoom(room);

      this.autoSyncCallback('roomEvent:join:room', group);
    });
  };

  onInvite: AutoSyncRoomEvent = async (room) => {
    room.on('invite', async (inviter) => {
      await this.roomAddContact(room, inviter);

      const group = await this.getRoom(room);

      this.autoSyncCallback('roomEvent:invite:room', group);
    });
  };

  onTopic: AutoSyncRoomEvent = async (room) => {
    room.on('topic', async (topic, oldTopic) => {
      const group = await this.updateRoom(room);

      this.autoSyncCallback('roomEvent:topic:room', group);

      // TODO 替换一下 Room
    });
  };

  onLeave: AutoSyncRoomEvent = async (room) => {
    room.on('leave', async (leaverList) => {
      await this.roomRemoveContacts(room, leaverList);
    });
  };

  autoSyncCallback = (actionType: string, content?: any) => {
    if (!this.autoSyncCallbackConfig) return;

    const { url, token } = this.autoSyncCallbackConfig;

    axios.post(
      url,
      {
        actionType,
        content
      },
      {
        headers: {
          authorization: token || ''
        }
      }
    );
  };

  getAuthMiniProgram(contact: Contact) {
    if (!contact) return null;

    const { id } = contact;

    const urlQuery = {
      provider: this.provider,
      contactId: id,
      clientId: this.options.userPoolId,
      secret: this.options.secret,
      host: this.options.host
    };

    return this.getMiniProgramConfig(urlQuery);
  }

  getMiniProgramConfig(urlQuery: Record<string, any>) {
    const queryString = urlQuery ? `?${qs.stringify(urlQuery)}` : '';

    return {
      appid: 'wxa0435021fd7a3af2',
      username: 'gh_a781a791e29e@app',
      title: '小登录 - 新的登录方式',
      description: '小登录',
      pagePath: `routes/explore.html${queryString}`,
      iconUrl:
        'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5kqJF20rB7kiasoEQDTKFs61ryIEddycKWS8MGTQsgJEg/96',
      thumbUrl:
        '308186020100047a30780201000204545ea08702034c4c6d0204b615b87b02046141afd704536175706170706d73675f613636613234623439363935653663625f313633313639343830363734345f32343531385f32323035313966342d303837332d346632302d613339332d3539633331666231323833610204011400030201000405004c4c6d00',
      thumbKey: '4004151918757dc35fb26c169e267ee3'
    };

    // return {
    //     appid: 'wx0a2b3899f197f949',
    //     username: 'gh_4d7b158f2450@app',
    //     title: '小登录 - 新的登录方式',
    //     description: 'Authing 小登录测试',
    //     pagePath: `routes%2Fwechaty%2Fauth.html`,
    //     iconUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6ypia1EicVtpLlgstjIm9PAqvzzwov04BicePhF7ckOeg7A/96',
    // tslint:disable-next-line:max-line-length
    //     thumbUrl: '308186020100047a30780201000204545ea08702034c4c6d02049815b87b02046142fa5704536175706170706d73675f613636613234623439363935653663625f313633313737393431343736395f32343935305f37363231623030352d363332362d346165372d623565362d3739366336356437323265380204011400030201000405004c4c6d00',
    //     thumbKey: 'b28f5859310e54c7ac791ef0836be1ad'
    // }
  }
}
