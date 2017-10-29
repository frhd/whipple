import { NAME } from "./constants";

export const PARTICIPANT_CAMERA_TOGGLE = `${NAME}/camera/toggle`;

export const PARTICIPANT_SHOW_AGREEMENT = `${NAME}/communication/agreement`;
export const PARTICIPANT_SHOW_DISAGREEMENT = `${NAME}/communication/disagreement`;
export const PARTICIPANT_SHOW_IMPATIENCE = `${NAME}/communication/impatience`;

export const PARTICIPANT_EXPAND_TIME_REQUEST = `${NAME}/talk/expand_time/request`;
export const PARTICIPANT_EXPAND_TIME_SUCCESSFUL = `${NAME}/talk/expand_time/successful`;
export const PARTICIPANT_EXPAND_TIME_FAILED = `${NAME}/talk/expand_time/failed`;

export const PARTICIPANT_LETMETALK_REQUEST = `${NAME}/talk/letmetalk/request`;
export const PARTICIPANT_LETMETALK_SUCCESSFUL = `${NAME}/talk/letmetalk/successful`;
export const PARTICIPANT_LETMETALK_FAILED = `${NAME}/talk/letmetalk/failed`;

export const PARTICIPANT_QUEUE_JOIN = `${NAME}/queue/join`;
export const PARTICIPANT_QUEUE_LEAVE = `${NAME}/queue/leave`;

// Überhaupt sinnvoll? Der Client existiert ja erst wenn er einem Raum beitritt
export const PARTICIPANT_ROOM_JOIN_REQUEST = `${NAME}/room/join/request`;
export const PARTICIPANT_ROOM_JOIN_SUCCESSFUL = `${NAME}/room/join/successful`;
export const PARTICIPANT_ROOM_JOIN_FAILED = `${NAME}/room/join/failed`;
export const PARTICIPANT_ROOM_LEAVE_REQUEST = `${NAME}/room/leave/request`;
export const PARTICIPANT_ROOM_LEAVE_SUCCESSFUL = `${NAME}/room/leave/successful`;
export const PARTICIPANT_ROOM_LEAVE_FAILED = `${NAME}/room/leave/failed`;

export const PARTICIPANT_SIGNAL_SEND_REQUEST = `${NAME}/signal/send/request`;
export const PARTICIPANT_SIGNAL_SEND_SUCCESSFUL = `${NAME}/signal/send/successful`;
export const PARTICIPANT_SIGNAL_SEND_FAILED = `${NAME}/signal/send/failed`;
export const PARTICIPANT_SIGNAL_RECEIVE = `${NAME}/signal/receive`;
