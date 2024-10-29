import io from 'socket.io-client';
<<<<<<< HEAD
const SOCKET_URL =
    process.env.NODE_ENV === 'production'
        ? 'https://vercel.com/idonices-projects/tic-tac-toe-server/'
        : 'http://localhost:5000';


export default io(SOCKET_URL);
=======
export default io('https://tic-tac-toe-backend-8p9l.onrender.com');
>>>>>>> 7a5ea2cb35175e749c7af4c692022de6ca6da39c
