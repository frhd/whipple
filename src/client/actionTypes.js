import { NAME } from "./constants";

export const CLIENT_CAMERA_TOGGLE = `${NAME}/camera/toggle`;

export const CLIENT_SHOW_AGREEMENT = `${NAME}/communication/agreement`;
export const CLIENT_SHOW_DISAGREEMENT = `${NAME}/communication/disagreement`;
export const CLIENT_SHOW_IMPATIENCE = `${NAME}/communication/impatience`;

export const CLIENT_EXPAND_TIME_REQUEST = `${NAME}/talk/expand_time/request`;
export const CLIENT_EXPAND_TIME_SUCCESSFUL = `${NAME}/talk/expand_time/successful`;
export const CLIENT_EXPAND_TIME_FAILED = `${NAME}/talk/expand_time/failed`;

export const CLIENT_LETMETALK_REQUEST = `${NAME}/talk/letmetalk/request`;
export const CLIENT_LETMETALK_SUCCESSFUL = `${NAME}/talk/letmetalk/successful`;
export const CLIENT_LETMETALK_FAILED = `${NAME}/talk/letmetalk/failed`;

export const CLIENT_QUEUE_JOIN = `${NAME}/queue/join`;
export const CLIENT_QUEUE_LEAVE = `${NAME}/queue/leave`;

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
