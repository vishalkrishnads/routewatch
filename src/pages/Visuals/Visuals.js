import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { hasAccount } from '../../assets/db';
import Map from '../../assets/components/map'
import Loader from '../../assets/components/loader'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import './styles.css';

const Visuals = () => {

    const [status, setStatus] = useState({ message: '', icon: <Loader /> });
    const [popClass, setPop] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        if(!hasAccount()) navigate('/account')
            
        
    }, [])

    const toast = (message = '', icon = 'working') => {
        const icons = {
            'success': <CheckCircleIcon />,
            'error': <ErrorIcon />,
            'warning': <WarningIcon />,
            'working': <Loader />
        }

        const show = () => {
            setPop('pop-up');
            setStatus({ message, icon: icons[icon] });
        }

        const hide = () => {
            setPop('pop-down');
            setStatus({ message: '', icon: <Loader /> });
            setTimeout(() => setPop(''), 1000)
        }

        if (!message) {
            hide();
            return;
        }

        show();
    }

    return <div style={{ flex: 1 }}>
        <Map />
        <div id="toast" style={{ display: popClass ? 'flex' : 'none' }} className={`status ${popClass}`}>
            <div className='icon'>{status.icon}</div>
            <div className="text">{status.message}</div>
        </div>
        <div className="controls">
            <div className="top">
                <div className="border"></div>
                <div className="date from">
                    <p>from</p>
                    <input className="value" id="from" type="date" />
                </div>
                <div className="date to">
                    <p>to</p>
                    <input className="value" id="to" type="date" />
                </div>
                <div className="border"></div>
            </div>
            <div className="bottom">
                <button>change account</button>
                <div className="legend">
                    <p className="marker" style={{ color: 'blue' }}>-</p>
                    <p>human</p>
                    <p className="marker" style={{ color: 'green', marginLeft: '10px' }}>-</p>
                    <p>openpilot</p>
                </div>
            </div>
        </div>
    </div>
}

export default Visuals;
