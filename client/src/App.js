import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Game from './components/Game';
import JoiningRoom from './pages/JoiningRoom';
import WaitingRoom from './pages/WaitingRoom';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';

const App = () => {

  return (
    <div className='app'>
      <div className='layout' >
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/menu' element={<h1>menu</h1>} />
            <Route path='/join' element={<JoiningRoom />} />
            <Route path='/waiting' element={<WaitingRoom />} />
            <Route path='/game' element={<Game />} />
            <Route path='/create' element={<CreateRoom />} />
          </Routes>
        </Router>

      </div>

    </div>
  );
}

export default App;
