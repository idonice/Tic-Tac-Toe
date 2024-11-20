import io from 'socket.io-client';
const SOCKET_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://web-production-2d67.up.railway.app/'
        : 'http://localhost:5000';


export default io(SOCKET_URL);