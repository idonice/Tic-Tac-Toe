import io from 'socket.io-client';
const SOCKET_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://vercel.com/idonices-projects/tic-tac-toe-server/'
        : 'http://localhost:5000';


export default io(SOCKET_URL);
