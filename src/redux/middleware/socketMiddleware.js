import io from 'socket.io-client';

const socketMiddleware = () => {
  let socket = null;

  return store => next => action => {
    if (action.type === 'CONNECT_SOCKET') {
      if (socket) socket.disconnect();

      socket = io('http://localhost:5000');

      socket.on('connect', () => {
        console.log('Socket connected');
        const sessionId = store.getState().session.sessionId;
        socket.emit('joinSession', sessionId);
      });

      socket.on('diagramUpdated', ({ action: receivedAction, data }) => {
        console.log('Received update:', receivedAction.type);

        store.dispatch({
          type: receivedAction.type,
          payload: data,
          meta: { remote: true },
        });
      });

      socket.on('initializeSession', (diagramData) => {
        console.log('Initializing session with data:', diagramData);
        store.dispatch({
          type: 'IMPORT_DIAGRAM',
          payload: diagramData,
        });
      });
    }

    if (action.type === 'DISCONNECT_SOCKET') {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }

    const syncActionTypes = [
      'ADD_CLASS',
      'UPDATE_CLASS_POSITION',
      'UPDATE_CLASS_NAME',
      'DELETE_CLASS',
      'ADD_ATTRIBUTE',
      'UPDATE_ATTRIBUTE',
      'DELETE_ATTRIBUTE',
      'ADD_METHOD',
      'UPDATE_METHOD',
      'DELETE_METHOD',
      'ADD_RELATIONSHIP',
      'UPDATE_RELATIONSHIP_CARDINALITY',
      'DELETE_RELATIONSHIP',
    ];

    if (
      syncActionTypes.includes(action.type) &&
      !action.meta?.remote &&
      socket
    ) {
      const sessionId = store.getState().session.sessionId;

      socket.emit('diagramUpdate', {
        sessionId,
        action: { type: action.type },
        data: action.payload,
      });
    }

    return next(action);
  };
};

export default socketMiddleware; 