import './App.css';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import { useEffect } from 'react';
import { account, request } from '@commaai/api/src'
import Accounts from './pages/Account/Account';
import Devices from './pages/Devices/Devices';
import Visuals from './pages/Visuals/Visuals';

function App() {

  // useEffect(() => {
  //   request.configure('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDg1ODI0NjUsIm5iZiI6MTcxNzA0NjQ2NSwiaWF0IjoxNzE3MDQ2NDY1LCJpZGVudGl0eSI6IjBkZWNkZGNmZGYyNDFhNjAifQ.g3khyJgOkNvZny6Vh579cuQj1HLLGSDeauZbfZri9jw')
  //   account.getProfile()
  //   .then(res => console.log(res))
  // }, [])

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/' element={<Accounts />} />
          <Route path='/device' element={<Devices />} />
          <Route path='/visuals' element={<Visuals />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
