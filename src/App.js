import './App.css';
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '@commaai/api'
import Accounts from './pages/Account/Account';
import Devices from './pages/Devices/Devices';
import Visuals from './pages/Visuals/Visuals';
import { getAccount, hasAccount } from './assets/db';
import { CONFIGS } from './assets/config';

function App() {

  const navigate = useNavigate();

  // check if the user has already logged in with an account.
  // if so, redirect to the device selection page, otherwise show the account login page
  useEffect(() => {
    if (hasAccount()) {
      // configure ConfigReuqest with the token.
      // the token might expire in 90 days, that hasn't been handled here. this is a minimal implementation.
      request.configure(getAccount().token);
      navigate(CONFIGS.ROUTES.DEVICE);
    }
    else navigate(CONFIGS.ROUTES.ACCOUNT);
    // eslint-disable-next-line
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
