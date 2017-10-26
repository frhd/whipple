import { NAME } from "./constants";

export const QUEUE_JOIN = `${NAME}/queue/join`;
export const QUEUE_LEAVE = `${NAME}/queue/leave`;

// Überhaupt sinnvoll? Der Client existiert ja erst wenn er einem Raum beitritt
export const CLIENT_ROOM_JOIN_REQUEST = `${NAME}/room/join/request`;
export const CLIENT_ROOM_JOIN_SUCCESSFUL = `${NAME}/room/join/successful`;
export const CLIENT_ROOM_JOIN_FAILED = `${NAME}/room/join/failed`;
export const CLIENT_ROOM_LEAVE_REQUEST = `${NAME}/room/leave/request`;
export const CLIENT_ROOM_LEAVE_SUCCESSFUL = `${NAME}/room/leave/successful`;
export const CLIENT_ROOM_LEAVE_FAILED = `${NAME}/room/leave/failed`;

export const CLIENT_SIGNAL_SEND_REQUEST = `${NAME}/signal/send/request`;
export const CLIENT_SIGNAL_SEND_SUCCESSFUL = `${NAME}/signal/send/successful`;
export const CLIENT_SIGNAL_SEND_FAILED = `${NAME}/signal/send/failed`;
export const CLIENT_SIGNAL_RECEIVE = `${NAME}/signal/receive`;
