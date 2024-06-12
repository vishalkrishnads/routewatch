import { useState } from 'react';
import { account, request } from '@commaai/api'
import { useNavigate } from 'react-router-dom';
import Greeting from '../../assets/components/greeting';
import './styles.css'
import Loader from '../../assets/components/loader';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { addAccount, addDevices } from '../../assets/db';

const Accounts = () => {

    const [status, setStatus] = useState('')
    const [token, setToken] = useState('')
    const navigate = useNavigate();

    const login = (loginToken) => {
        request.configure(loginToken)
        setStatus('authenticating, please wait...');
        account.getProfile()
            .then(res => {
                addAccount(loginToken, res.username)
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
                    onClick={() => login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDg1ODI0NjUsIm5iZiI6MTcxNzA0NjQ2NSwiaWF0IjoxNzE3MDQ2NDY1LCJpZGVudGl0eSI6IjBkZWNkZGNmZGYyNDFhNjAifQ.g3khyJgOkNvZny6Vh579cuQj1HLLGSDeauZbfZri9jw')}
                >Continue with demo account</button>
            </div>}
        <div className="border footer">
            <p>with love from india</p>
            <a href="https://github.com/vishalkrishnads/routewatch">source code</a>
        </div>
    </div>
}

export default Accounts;
