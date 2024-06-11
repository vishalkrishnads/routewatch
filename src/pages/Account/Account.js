import { useState } from 'react';
import Greeting from '../../assets/components/greeting';
import './styles.css'
import Loader from '../../assets/components/loader';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const Accounts = () => {

    const [status, setStatus] = useState('')
    const [token, setToken] = useState('')

    return <div className='body'>
        <div className="border"></div>
        {status ?
            <div className='content'>
                <Loader info={status} />
            </div>
            : <div className="content">
                <Greeting head={'routewatch'} caption={'now when you & openpilot drove'} />

                <div className="token">
                    <input
                        type="text"
                        placeholder="Enter your account token"
                        value={token}
                        onChange={event => setToken(event.target.value)}
                    />
                    {token ? <KeyboardDoubleArrowRightIcon className='icon' /> : null}
                </div>
                <button id="demo-button">Continue with demo account</button>
            </div>}
        <div className="border footer">
            <p>with love from india</p>
            <a href="https://github.com/vishalkrishnads/routewatch">source code</a>
        </div>
    </div>
}

export default Accounts;
