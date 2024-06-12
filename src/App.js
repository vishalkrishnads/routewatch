import './App.css';
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '@commaai/api'
import Accounts from './pages/Account/Account';
import Devices from './pages/Devices/Devices';
import Visuals from './pages/Visuals/Visuals';
import { getAccount, hasAccount } from './assets/db';

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    if (hasAccount()) {
      request.configure(getAccount().token)
      navigate('/device')
    }
    else navigate('/account')
  }, [])

  return (
    <div className='App'>
      <Routes initial={'/account'}>
        <Route path='/account' element={<Accounts />} />
        <Route path='/device' element={<Devices />} />
        <Route path='/' element={<Visuals />} />
      </Routes>
    </div>
  );
}

export default App;
