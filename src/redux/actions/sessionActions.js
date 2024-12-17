// client/src/redux/actions/sessionActions.js
import axios from 'axios';
import { setSessionId } from './socketActions';

export const CREATE_SESSION_REQUEST = 'CREATE_SESSION_REQUEST';
export const CREATE_SESSION_SUCCESS = 'CREATE_SESSION_SUCCESS';
export const CREATE_SESSION_FAILURE = 'CREATE_SESSION_FAILURE';

export const JOIN_SESSION_REQUEST = 'JOIN_SESSION_REQUEST';
export const JOIN_SESSION_SUCCESS = 'JOIN_SESSION_SUCCESS';
export const JOIN_SESSION_FAILURE = 'JOIN_SESSION_FAILURE';

export const createSession = () => async (dispatch) => {
  dispatch({ type: CREATE_SESSION_REQUEST });
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('User not authenticated');
    }

    const response = await axios.post('http://localhost:5000/api/session/create', {
      userId: user.id,
      name: `New Diagram ${new Date().toLocaleString()}`
    });

    const { sessionId } = response.data;
    dispatch({ type: CREATE_SESSION_SUCCESS, payload: sessionId });
    dispatch(setSessionId(sessionId));
    return sessionId;
  } catch (error) {
    dispatch({ type: CREATE_SESSION_FAILURE, payload: error.message });
    throw error;
  }
};

export const joinSession = (sessionId) => async (dispatch) => {
  dispatch({ type: JOIN_SESSION_REQUEST });
  try {
    const response = await axios.post('/api/session/join', { sessionId });
    dispatch({ type: JOIN_SESSION_SUCCESS, payload: sessionId });
    dispatch(setSessionId(sessionId));
    return sessionId;
  } catch (error) {
    dispatch({ type: JOIN_SESSION_FAILURE, payload: error.message });
    throw error;
  }
};
