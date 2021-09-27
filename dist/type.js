"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoSyncRoomEventEnum = exports.AutoSyncEventEnum = void 0;
var AutoSyncEventEnum;
(function (AutoSyncEventEnum) {
    AutoSyncEventEnum["Message"] = "message";
})(AutoSyncEventEnum = exports.AutoSyncEventEnum || (exports.AutoSyncEventEnum = {}));
var AutoSyncRoomEventEnum;
(function (AutoSyncRoomEventEnum) {
    AutoSyncRoomEventEnum["JOIN"] = "join";
    AutoSyncRoomEventEnum["INVITE"] = "invite";
    AutoSyncRoomEventEnum["TOPIC"] = "topic";
    AutoSyncRoomEventEnum["LEAVE"] = "leave";
})(AutoSyncRoomEventEnum = exports.AutoSyncRoomEventEnum || (exports.AutoSyncRoomEventEnum = {}));
