// client/src/redux/reducers/sessionReducer.js
import {
    CREATE_SESSION_REQUEST,
    CREATE_SESSION_SUCCESS,
    CREATE_SESSION_FAILURE,
    JOIN_SESSION_REQUEST,
    JOIN_SESSION_SUCCESS,
    JOIN_SESSION_FAILURE,
  } from '../actions/sessionActions';
  
  const initialState = {
    loading: false,
    error: null,
    sessionId: null,
  };
  
  const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
      case CREATE_SESSION_REQUEST:
      case JOIN_SESSION_REQUEST:
        return { ...state, loading: true, error: null };
      case CREATE_SESSION_SUCCESS:
      case JOIN_SESSION_SUCCESS:
        return { ...state, loading: false, sessionId: action.payload };
      case CREATE_SESSION_FAILURE:
      case JOIN_SESSION_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case 'SET_SESSION_ID':
        return {
          ...state,
          sessionId: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default sessionReducer;
  