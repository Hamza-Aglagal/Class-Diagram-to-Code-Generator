// client/src/redux/actions/socketActions.js
export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const DISCONNECT_SOCKET = 'DISCONNECT_SOCKET';
export const UPDATE_CLASS_DIAGRAM = 'UPDATE_CLASS_DIAGRAM';
export const UPDATE_CODE_VIEWER = 'UPDATE_CODE_VIEWER';
export const SET_SESSION_ID = 'SET_SESSION_ID';

export const connectSocket = () => ({
  type: CONNECT_SOCKET,
});

export const disconnectSocket = () => ({
  type: DISCONNECT_SOCKET,
});

export const updateClassDiagram = (data) => ({
  type: UPDATE_CLASS_DIAGRAM,
  payload: data,
});

export const updateCodeViewer = (code) => ({
  type: UPDATE_CODE_VIEWER,
  payload: code,
});

export const setSessionId = (sessionId) => ({
  type: SET_SESSION_ID,
  payload: sessionId,
});
