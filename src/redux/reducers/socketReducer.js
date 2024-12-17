// client/src/redux/reducers/socketReducer.js
import {
    CONNECT_SOCKET,
    DISCONNECT_SOCKET,
    UPDATE_CLASS_DIAGRAM,
    UPDATE_CODE_VIEWER,
    SET_SESSION_ID,
  } from '../actions/socketActions';
  
  const initialState = {
    connected: false,
    error: null
  };
  
  const socketReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SOCKET_CONNECTED':
        return {
          ...state,
          connected: true,
          error: null
        };
      case 'SOCKET_DISCONNECTED':
        return {
          ...state,
          connected: false
        };
      case 'SOCKET_ERROR':
        return {
          ...state,
          error: action.payload
        };
      default:
        return state;
    }
  };
  
  export default socketReducer;
  