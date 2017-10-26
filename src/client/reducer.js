import * as type from "./actionTypes";

const initialState = {
    cameraOn: true,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case type.CLIENT_QUEUE_JOIN:
            return {
                ...state,
                // do stuff with the queue
            };

        case type.CLIENT_QUEUE_LEAVE:
            return {
                ...state,
                // do stuff with the queue
            };

        default:
            return initialState;
    }
};