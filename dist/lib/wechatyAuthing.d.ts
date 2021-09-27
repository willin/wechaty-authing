import { ActionAddContact, ActionAddRoom, ActionCreateContact, ActionCreateRoom, ActionGetContact, ActionGetRoom, ActionRemoveContact, ActionRemoveRoom, ActionRoomAddContact, ActionRoomAddContacts, ActionRoomRemoveContact, ActionRoomRemoveContacts, ActionRoomSyncContacts, ActionRooomGetContacts, ActionSyncContact, ActionSyncRoom, ActionUpdateContact, ActionUpdateRoom, AutoSyncEvent, AutoSyncRoomEvent, PluginOptions, WechatyAuthingOptions } from '../type';
import { ManagementClient } from 'authing-js-sdk';
import { Contact, Wechaty } from 'wechaty';
export declare class WechatyAuthing {
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
    private managementClient;
    private usersClient;
    private groupsClient;
    private puppet;
    private provider;
    private autoSyncRoomConfig;
    private autoSyncEventConfig;
    private autoSyncCallbackConfig;
    constructor(options: WechatyAuthingOptions);
    plugin: (option?: PluginOptions | undefined) => (bot: Wechaty) => Wechaty;
    install: (bot: Wechaty) => Wechaty;
    getManagementClient: () => ManagementClient;
    syncContact: ActionSyncContact;
    removeContact: ActionRemoveContact;
    updateContact: ActionUpdateContact;
    addContact: ActionAddContact;
    createContact: ActionCreateContact;
    getContact: ActionGetContact;
    getRoom: ActionGetRoom;
    addRoom: ActionAddRoom;
    createRoom: ActionCreateRoom;
    updateRoom: ActionUpdateRoom;
    removeRoom: ActionRemoveRoom;
    syncRoom: ActionSyncRoom;
    roomAddContacts: ActionRoomAddContacts;
    roomAddContact: ActionRoomAddContact;
    roomRemoveContacts: ActionRoomRemoveContacts;
    roomRemoveContact: ActionRoomRemoveContact;
    rooomGetContacts: ActionRooomGetContacts;
    roomSyncContacts: ActionRoomSyncContacts;
    private initAutoSyncEvent;
    private initAutoSyncRoom;
    onMessage: AutoSyncEvent;
    onJoin: AutoSyncRoomEvent;
    onInvite: AutoSyncRoomEvent;
    onTopic: AutoSyncRoomEvent;
    onLeave: AutoSyncRoomEvent;
    autoSyncCallback: (actionType: string, content?: any) => void;
    getAuthMiniProgram(contact: Contact): {
        appid: string;
        username: string;
        title: string;
        description: string;
        pagePath: string;
        iconUrl: string;
        thumbUrl: string;
        thumbKey: string;
    } | null;
    getMiniProgramConfig(urlQuery: Record<string, any>): {
        appid: string;
        username: string;
        title: string;
        description: string;
        pagePath: string;
        iconUrl: string;
        thumbUrl: string;
        thumbKey: string;
    };
}
