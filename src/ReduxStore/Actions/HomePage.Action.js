import {
    GET_USER,
    GET_MESSAGE,
    APPEND_NEW_MESSAGE_PAGINATION
} from './ActionTypes';

//get users in first page
export const getUsersAction = (payload) => {
    return {
        type: GET_USER,
        payload
    };
};


//get messages of perticular user
export const getMessagesAction = (payload) => {
    return {
        type:GET_MESSAGE ,
        payload
    };
};

export const append_new_msg_pagination = (payload) => {
    return {
        type: APPEND_NEW_MESSAGE_PAGINATION,
        payload
    };
};