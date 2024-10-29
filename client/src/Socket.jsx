import io from 'socket.io-client';
const SOCKET_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://tic-tac-toe-backend-8p9l.onrender.com'
        : 'http://localhost:5000';


export default io(SOCKET_URL);