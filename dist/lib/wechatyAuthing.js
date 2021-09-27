"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatyAuthing = void 0;
var type_1 = require("../type");
var authing_js_sdk_1 = require("authing-js-sdk");
var query_string_1 = __importDefault(require("query-string"));
var axios_1 = __importDefault(require("axios"));
var WechatyAuthing = /** @class */ (function () {
    function WechatyAuthing(options) {
        var _this = this;
        this.autoSyncRoomConfig = {
            roomList: [],
            eventList: [],
        };
        this.autoSyncEventConfig = [];
        this.autoSyncCallbackConfig = null;
        this.plugin = function (option) {
            if (!option)
                return _this.install;
            var autoSyncRoomConfig = option.autoSyncRoomConfig, autoSyncEventConfig = option.autoSyncEventConfig, autoSyncCallback = option.autoSyncCallback;
            if (autoSyncEventConfig)
                _this.autoSyncEventConfig = autoSyncEventConfig;
            if (autoSyncRoomConfig)
                _this.autoSyncRoomConfig = autoSyncRoomConfig;
            if (autoSyncCallback)
                _this.autoSyncCallbackConfig = autoSyncCallback;
            return _this.install;
        };
        this.install = function (bot) {
            var _a;
            _this.puppet = (_a = bot.puppet.name()) !== null && _a !== void 0 ? _a : 'wechaty-puppet';
            _this.provider = "wechaty:" + _this.puppet;
            _this.initAutoSyncEvent(bot);
            _this.initAutoSyncRoom(bot);
            return bot;
        };
        this.getManagementClient = function () {
            return _this.managementClient;
        };
        this.syncContact = function (contact) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContact(contact)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateContact(contact)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.addContact(contact)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.removeContact = function (contact) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContact(contact)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.usersClient.delete(user.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.updateContact = function (contact) { return __awaiter(_this, void 0, void 0, function () {
            var user, avatar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContact(contact)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.getContact(contact)];
                    case 2:
                        if (!(_a.sent()))
                            throw new Error('this contact does not exist in Authing');
                        avatar = contact.payload.avatar;
                        return [4 /*yield*/, this.usersClient.update(user.id, {
                                username: contact.weixin(),
                                nickname: contact.name(),
                                phone: avatar,
                            })];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.addContact = function (contact) { return __awaiter(_this, void 0, void 0, function () {
            var user, avatar, userinfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getContact(contact)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            return [2 /*return*/, user];
                        avatar = contact.payload.avatar;
                        userinfo = {
                            nickname: contact.name(),
                            photo: avatar,
                            username: contact.weixin(),
                        };
                        return [4 /*yield*/, this.usersClient.create(userinfo, {
                                identity: {
                                    userIdInIdp: contact.id,
                                    provider: this.provider,
                                },
                            })];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        this.createContact = function (contact) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addContact(contact)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.getContact = function (contact) { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersClient.find({
                            identity: {
                                userIdInIdp: contact.id,
                                provider: this.provider,
                            },
                        })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        }); };
        this.getRoom = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.groupsClient.detail(room.id)];
                    case 1:
                        group = _a.sent();
                        return [2 /*return*/, group];
                }
            });
        }); };
        this.addRoom = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var group, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getRoom(room)];
                    case 1:
                        group = _d.sent();
                        if (group)
                            return [2 /*return*/, group];
                        _b = (_a = this.groupsClient).create;
                        _c = [room.id];
                        return [4 /*yield*/, room.topic()];
                    case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
                    case 3:
                        group = _d.sent();
                        return [2 /*return*/, group];
                }
            });
        }); };
        this.createRoom = function (room) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addRoom(room)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.updateRoom = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var group, _a, _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.getRoom(room)];
                    case 1:
                        group = _e.sent();
                        if (!group)
                            throw new Error('this room does not exist in Authing');
                        _b = (_a = this.groupsClient).update;
                        _c = [group.code];
                        _d = {};
                        return [4 /*yield*/, room.topic()];
                    case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([(_d.name = _e.sent(),
                                _d)]))];
                    case 3:
                        group = _e.sent();
                        return [2 /*return*/, group];
                }
            });
        }); };
        this.removeRoom = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRoom(room)];
                    case 1:
                        group = _a.sent();
                        if (!group)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.groupsClient.delete(group.code)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.syncRoom = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRoom(room)];
                    case 1:
                        group = _a.sent();
                        if (!group) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.updateRoom(room)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [4 /*yield*/, this.addRoom(room)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.roomAddContacts = function (room, contactList) { return __awaiter(_this, void 0, void 0, function () {
            var group, resList, userList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.syncRoom(room)];
                    case 1:
                        group = _a.sent();
                        resList = contactList.map(function (contact) { return _this.syncContact(contact); });
                        return [4 /*yield*/, Promise.all(resList)];
                    case 2:
                        userList = _a.sent();
                        return [4 /*yield*/, this.groupsClient.addUsers(group.code, userList.map(function (user) { return user.id; }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.roomAddContact = function (room, contact) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.roomAddContacts(room, [contact])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.roomRemoveContacts = function (room, contactList) { return __awaiter(_this, void 0, void 0, function () {
            var group, userList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.syncRoom(room)];
                    case 1:
                        group = _a.sent();
                        return [4 /*yield*/, Promise.all(contactList.map(function (contact) { return _this.syncContact(contact); }))];
                    case 2:
                        userList = _a.sent();
                        return [4 /*yield*/, this.groupsClient.removeUsers(group.code, userList.map(function (user) { return user.id; }))];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.roomRemoveContact = function (room, contact) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.roomRemoveContacts(room, [contact])];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.rooomGetContacts = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var group, userList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.syncRoom(room)];
                    case 1:
                        group = _a.sent();
                        return [4 /*yield*/, this.groupsClient.listUsers(group.code, {
                                page: 1,
                                limit: -1,
                            })];
                    case 2:
                        userList = _a.sent();
                        return [2 /*return*/, userList.list];
                }
            });
        }); };
        this.roomSyncContacts = function (room, contactList) { return __awaiter(_this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRoom(room)];
                    case 1:
                        group = _a.sent();
                        if (!group) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.groupsClient.delete(group.code)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.roomAddContacts(room, contactList)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        }); };
        this.initAutoSyncEvent = function (bot) { return __awaiter(_this, void 0, void 0, function () {
            var eventMapping, onEventList;
            var _a;
            return __generator(this, function (_b) {
                eventMapping = (_a = {},
                    _a[type_1.AutoSyncEventEnum.Message] = this.onMessage,
                    _a);
                onEventList = this.autoSyncEventConfig.map(function (event) { return eventMapping[event]; });
                onEventList.forEach(function (event) { return event(bot); });
                return [2 /*return*/];
            });
        }); };
        this.initAutoSyncRoom = function (bot) { return __awaiter(_this, void 0, void 0, function () {
            var _a, roomTopicList, eventList, roomList, eventMapping, onEventList;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.autoSyncRoomConfig, roomTopicList = _a.roomList, eventList = _a.eventList;
                        return [4 /*yield*/, Promise.all(roomTopicList.map(function (roomTopic) { return bot.Room.find({ topic: roomTopic }); }))];
                    case 1:
                        roomList = _c.sent();
                        roomList.filter(function (room) { return !!room; });
                        eventMapping = (_b = {},
                            _b[type_1.AutoSyncRoomEventEnum.INVITE] = this.onInvite,
                            _b[type_1.AutoSyncRoomEventEnum.JOIN] = this.onJoin,
                            _b[type_1.AutoSyncRoomEventEnum.LEAVE] = this.onLeave,
                            _b[type_1.AutoSyncRoomEventEnum.TOPIC] = this.onTopic,
                            _b);
                        onEventList = eventList.map(function (event) { return eventMapping[event]; });
                        roomList
                            .filter(function (room) { return !!room; })
                            .map(function (room) { return onEventList.forEach(function (event) { return event(room); }); });
                        return [2 /*return*/];
                }
            });
        }); };
        this.onMessage = function (bot) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                bot.on('message', function (message) { return __awaiter(_this, void 0, void 0, function () {
                    var contact, room, user, group;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                contact = message.talker();
                                room = message.room();
                                return [4 /*yield*/, this.syncContact(contact)];
                            case 1:
                                user = _a.sent();
                                this.autoSyncCallback('event:message:contcat', user);
                                if (!room) return [3 /*break*/, 3];
                                return [4 /*yield*/, this.syncRoom(room)];
                            case 2:
                                group = _a.sent();
                                this.autoSyncCallback('event:message:room', group);
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        this.onJoin = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                room.on('join', function (inviteeList) { return __awaiter(_this, void 0, void 0, function () {
                    var group;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.roomAddContacts(room, inviteeList)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.getRoom(room)];
                            case 2:
                                group = _a.sent();
                                this.autoSyncCallback('roomEvent:join:room', group);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        this.onInvite = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                room.on('invite', function (inviter) { return __awaiter(_this, void 0, void 0, function () {
                    var group;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.roomAddContact(room, inviter)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, this.getRoom(room)];
                            case 2:
                                group = _a.sent();
                                this.autoSyncCallback('roomEvent:invite:room', group);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        this.onTopic = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                room.on('topic', function (topic, oldTopic) { return __awaiter(_this, void 0, void 0, function () {
                    var group;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.updateRoom(room)];
                            case 1:
                                group = _a.sent();
                                this.autoSyncCallback('roomEvent:topic:room', group);
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        this.onLeave = function (room) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                room.on('leave', function (leaverList) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this.roomRemoveContacts(room, leaverList)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        }); };
        this.autoSyncCallback = function (actionType, content) {
            if (!_this.autoSyncCallbackConfig)
                return;
            var _a = _this.autoSyncCallbackConfig, url = _a.url, token = _a.token;
            axios_1.default.post(url, {
                actionType: actionType,
                content: content,
            }, {
                headers: {
                    authorization: token,
                },
            });
        };
        this.options = options;
        this.managementClient = new authing_js_sdk_1.ManagementClient(options);
        this.usersClient = this.managementClient.users;
        this.groupsClient = this.managementClient.groups;
        this.puppet = 'wechaty-puppet';
        this.provider = "wechaty:" + this.puppet;
    }
    WechatyAuthing.prototype.getAuthMiniProgram = function (contact) {
        if (!contact)
            return null;
        var id = contact.id;
        var urlQuery = {
            provider: this.provider,
            contactId: id,
            clientId: this.options.userPoolId,
            secret: this.options.secret,
            host: this.options.host,
        };
        return this.getMiniProgramConfig(urlQuery);
    };
    WechatyAuthing.prototype.getMiniProgramConfig = function (urlQuery) {
        var queryString = urlQuery ? "?" + query_string_1.default.stringify(urlQuery) : '';
        return {
            appid: 'wxa0435021fd7a3af2',
            username: 'gh_a781a791e29e@app',
            title: '小登录 - 新的登录方式',
            description: '小登录',
            pagePath: "routes/explore.html" + queryString,
            iconUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM5kqJF20rB7kiasoEQDTKFs61ryIEddycKWS8MGTQsgJEg/96',
            thumbUrl: '308186020100047a30780201000204545ea08702034c4c6d0204b615b87b02046141afd704536175706170706d73675f613636613234623439363935653663625f313633313639343830363734345f32343531385f32323035313966342d303837332d346632302d613339332d3539633331666231323833610204011400030201000405004c4c6d00',
            thumbKey: '4004151918757dc35fb26c169e267ee3',
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
    };
    return WechatyAuthing;
}());
exports.WechatyAuthing = WechatyAuthing;
