// client/src/utils/socket.js
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000'; // Replace with your server URL if different

const socket = io(SOCKET_SERVER_URL, {
  autoConnect: false,
});

export default socket;
