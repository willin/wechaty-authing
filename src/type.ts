import { Group as AuthingGroup, ManagementClientOptions, User } from "authing-js-sdk";
import { Contact, Message, Room, Wechaty } from "wechaty";

export interface AuthMiniProgramOptions {
    title?: string
    description?: string
    mainColor?: string
    authBut: {
        text?: string
        color?: string
    }
}

export interface PluginOptions {
    autoSyncRoomConfig?: AutoSyncRoomConfig
    autoSyncEventConfig?: AutoSyncEventConfig
    autoSyncCallback?: CallbackConfig
}

export interface CallbackConfig {
    url: string,
    token?: string
}

export enum AutoSyncEventEnum {
    Message = 'message'
}

export enum AutoSyncRoomEventEnum {
    JOIN = 'join',
    INVITE = 'invite',
    TOPIC = 'topic',
    LEAVE = 'leave'
}

export type AutoSyncEventConfig = Array<AutoSyncEventEnum>

export interface AutoSyncRoomConfig {
    roomList: Array<string>,
    eventList: Array<AutoSyncRoomEventEnum>
}

export interface WechatyAuthingOptions extends ManagementClientOptions {
}

export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export type Group = DeepPartial<AuthingGroup>


export type ActionSyncContact = (contact: Contact) => Promise<User>
export type ActionAddContact = (contact: Contact) => Promise<User>
export type ActionCreateContact = ActionAddContact
export type ActionUpdateContact = (contact: Contact) => Promise<User>
export type ActionGetContact = (contact: Contact) => Promise<User>
export type ActionRemoveContact = (contact: Contact) => Promise<boolean>

export type ActionFindContactListRoom = (contact: Contact) => Promise<Array<Group>>


export type ActionSyncRoom = (room: Room) => Promise<Group>
export type ActionGetRoom = (room: Room) => Promise<Group>
export type ActionCreateRoom = ActionAddRoom
export type ActionUpdateRoom = (room: Room) => Promise<Group>
export type ActionAddRoom = (room: Room) => Promise<Group>
export type ActionRemoveRoom = (room: Room) => Promise<boolean>


export type ActionRoomAddContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>
export type ActionRoomAddContact = (room: Room, contact: Contact) => Promise<boolean>

export type ActionRoomRemoveContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>
export type ActionRoomRemoveContact = (room: Room, contact: Contact) => Promise<boolean>

export type ActionRooomGetContacts = (room: Room) => Promise<Array<User>>

export type ActionRoomSyncContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>

export type AutoSyncEvent = (bot: Wechaty) => Promise<void> 
export type AutoSyncRoomEvent = (room: Room) => Promise<void> 