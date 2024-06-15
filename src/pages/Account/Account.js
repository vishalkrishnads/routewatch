/*
    Account selection page that lets users either:
        * login with an account token from https://jwt.comma.ai/
        * Use the demo account with the token provided in the challenge at https://github.com/commaai/jobs/blob/master/web.md
    Includes logic for fetching an account from the /v1/me route and storing it in the browser's localStorage.
*/

import { useState } from 'react';
import { account, request } from '@commaai/api';
import { useNavigate } from 'react-router-dom';
import { addAccount, addDevices } from '../../assets/db';
import { CONFIGS } from '../../assets/config';
import Greeting from '../../assets/components/greeting';
import Loader from '../../assets/components/loader';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './styles.css';

const Accounts = () => {

    const [status, setStatus] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const login = (loginToken) => {
        // configure ConfigRequest with the new token
        request.configure(loginToken)
        setStatus('authenticating, please wait...');
        // get profile details from /v1/me
        account.getProfile()
            .then(res => {
                // store the account details locally.
                addAccount(loginToken, res.username)
                // for now, set the devices list to be empty, the devices page will take care of the rest.
                addDevices([])
                navigate('/device')
            }).catch(error => {
                if (error.resp.status === 401) alert('wrong token! please try again')
                setToken('')
            })
        setStatus('')
    }

    return <div className='body'>
        <div className="border"></div>
        {status ?
            <div className='content'>
                <Loader info={status} />
            </div>
            : <div className="content">
                <Greeting head={'routewatch'} caption={'know when you & openpilot drove'} />

                <div className="token">
                    <input
                        type="text"
                        placeholder="Enter your account token"
                        value={token}
                        onChange={event => setToken(event.target.value)}
                    />
                    {token ? <KeyboardDoubleArrowRightIcon onClick={() => login(token)} className='icon' /> : null}
                </div>
                <button
                    onClick={() => login(CONFIGS.DEFAULT_ACCOUNT)}
                >Continue with demo account</button>
            </div>}
        <div className="border footer">
            <p>with love from india</p>
            <a href={CONFIGS.GIT_REPO} >source code</a>
        </div>
    </div>
}

export default Accounts;
