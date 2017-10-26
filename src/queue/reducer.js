import * as type from "./actionTypes";

const initialState = {
    cameraOn: true,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.QUEUE_JOIN:
            return {
                ...state,
                // do stuff with the queue
            };

        case type.QUEUE_LEAVE:
            return {
                ...state,
                // do stuff with the queue
            };

        default:
            return initialState;
    }
};