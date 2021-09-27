import { Group as AuthingGroup, ManagementClientOptions, User } from "authing-js-sdk";
import { Contact, Room, Wechaty } from "wechaty";
export interface AuthMiniProgramOptions {
    title?: string;
    description?: string;
    mainColor?: string;
    authBut: {
        text?: string;
        color?: string;
    };
}
export interface PluginOptions {
    autoSyncRoomConfig?: AutoSyncRoomConfig;
    autoSyncEventConfig?: AutoSyncEventConfig;
    autoSyncCallback?: CallbackConfig;
}
export interface CallbackConfig {
    url: string;
    token?: string;
}
export declare enum AutoSyncEventEnum {
    Message = "message"
}
export declare enum AutoSyncRoomEventEnum {
    JOIN = "join",
    INVITE = "invite",
    TOPIC = "topic",
    LEAVE = "leave"
}
export declare type AutoSyncEventConfig = Array<AutoSyncEventEnum>;
export interface AutoSyncRoomConfig {
    roomList: Array<string>;
    eventList: Array<AutoSyncRoomEventEnum>;
}
export interface WechatyAuthingOptions extends ManagementClientOptions {
}
export declare type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export declare type Group = DeepPartial<AuthingGroup>;
export declare type ActionSyncContact = (contact: Contact) => Promise<User>;
export declare type ActionAddContact = (contact: Contact) => Promise<User>;
export declare type ActionCreateContact = ActionAddContact;
export declare type ActionUpdateContact = (contact: Contact) => Promise<User>;
export declare type ActionGetContact = (contact: Contact) => Promise<User>;
export declare type ActionRemoveContact = (contact: Contact) => Promise<boolean>;
export declare type ActionFindContactListRoom = (contact: Contact) => Promise<Array<Group>>;
export declare type ActionSyncRoom = (room: Room) => Promise<Group>;
export declare type ActionGetRoom = (room: Room) => Promise<Group>;
export declare type ActionCreateRoom = ActionAddRoom;
export declare type ActionUpdateRoom = (room: Room) => Promise<Group>;
export declare type ActionAddRoom = (room: Room) => Promise<Group>;
export declare type ActionRemoveRoom = (room: Room) => Promise<boolean>;
export declare type ActionRoomAddContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>;
export declare type ActionRoomAddContact = (room: Room, contact: Contact) => Promise<boolean>;
export declare type ActionRoomRemoveContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>;
export declare type ActionRoomRemoveContact = (room: Room, contact: Contact) => Promise<boolean>;
export declare type ActionRooomGetContacts = (room: Room) => Promise<Array<User>>;
export declare type ActionRoomSyncContacts = (room: Room, contactList: Array<Contact>) => Promise<boolean>;
export declare type AutoSyncEvent = (bot: Wechaty) => Promise<void>;
export declare type AutoSyncRoomEvent = (room: Room) => Promise<void>;
