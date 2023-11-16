import {
    GET_USER,
    GET_MESSAGE,
    APPEND_NEW_MESSAGE_PAGINATION
} from "../Actions/ActionTypes"

const initialState = {
    users: [],
    msgs :[]
}

function homePage(state = initialState, action) {

    switch (action.type) {
        case GET_USER: {
            return {
                ...state,
                users: action.payload
            }
        }


        case GET_MESSAGE: {
            // console.log("action.payload" , action.payload);
            return {
                ...state,
                msgs: action.payload
                // msgs:action.payload
            }
        }

        case APPEND_NEW_MESSAGE_PAGINATION: {
            return {
                ...state,
                // msgs: [action.payload]
                // msgs: [ ...action.payload ,...state.msgs],
                // msgs : msgs1.reverse()
                msgs: [...state.msgs, ...action.payload]
            }
        }

        default:
            return state
    }

}

export default homePage

