import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasAccount } from '../../assets/db';
import { getRoutes } from '../../assets/api';
import { CONFIGS } from '../../assets/config';
import Map from '../../assets/components/map';
import Loader from '../../assets/components/loader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import './styles.css';

const DatePicker = ({ position, onSelect, date }) => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        const newDateValue = event.target.value;

        setSelectedDate(newDateValue.split('T')[0]);

        if (newDateValue) {
            const dateUTCString = new Date(newDateValue).getTime();
            onSelect(position === 'from' ? { ...date, from: dateUTCString } : { ...date, to: dateUTCString });
        } else {
            onSelect(position === 'from' ? { ...date, from: null } : { ...date, to: null });
        }
    };

    return (
        <div className={`date ${position}`}>
            <p>{position}</p>
            <input
                className="value"
                type="date"
                value={selectedDate} // Controlled component
                onChange={handleDateChange} // Handle date changes
            />
        </div>
    );
};

const Visuals = () => {

    const [status, setStatus] = useState({ message: '', icon: <Loader /> });
    const [popClass, setPop] = useState('');
    const [date, setDate] = useState({ from: null, to: null });
    const [isIndividual, setIndividual] = useState(true);
    const [drives, setDrives] = useState([]);
    const [drive, setDrive] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasAccount()) navigate(CONFIGS.ROUTES.ACCOUNT);
        // eslint-disable-next-line
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

    useEffect(() => {
        async function refresh() {
            if (date.from && date.to) {
                try {
                    toast('Fetching your drives...', 'working');
                    let routes = await getRoutes(date);
                    setDrive(0);
                    setDrives(routes);
                    toast('There you go!', 'success');
                } catch (e) { toast(e.message, 'error'); }
                setTimeout(() => toast(), 1000);
            }
        }

        refresh();
    }, [date])

    function formatDate(isoDateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', options);
    }

    return <div style={{ flex: 1 }}>
        <Map
            routes={
                isIndividual ?
                    (drives.length > 0 && [drives[drive].coords])
                    : drives.map(item => item.coords)
            }
        />
        <div id="toast" style={{ display: popClass ? 'flex' : 'none' }} className={`status ${popClass}`}>
            <div className='icon'>{status.icon}</div>
            <div className="text">{status.message}</div>
        </div>
        <div onClick={() => navigate(CONFIGS.ROUTES.DEVICE)} title='Switch device' className='switch'>
            <SwapHorizIcon className='icon' />
        </div>
        <div className="controls">
            <div className="top">
                <div className="border"></div>
                <DatePicker key={0} position={'from'} onSelect={setDate} date={date} />
                <div className='button'>
                    {drives.length > 0 && <button onClick={() => setIndividual(prev => !prev)} >{isIndividual ? 'view all drives' : 'see individual'}</button>}
                </div>
                <DatePicker key={1} position={'to'} onSelect={setDate} date={date} />
                <div className="border"></div>
            </div>
            <div className="bottom">
                {drives.length > 0 ? <div className='route'>
                    <div className='control previous'>
                        {drive > 0 && isIndividual && <div onClick={() => setDrive(prev => prev - 1)} className='button'><ChevronLeftIcon fontSize='large' /></div>}
                    </div>
                    <div className='metadata'>
                        <p>{isIndividual ? formatDate(drives[drive].date) : 'viewing all routes'}</p>
                    </div>
                    <div className='control next'>
                        {drive < drives.length - 1 && isIndividual && <div onClick={() => setDrive(prev => prev + 1)} className='button'><ChevronRightIcon fontSize='large' /></div>}
                    </div>
                </div> :
                    <div className='route'>
                        <div className='metadata'>
                            <p>select a date range to see your routes</p>
                        </div>
                    </div>}
                {drives.length > 0 && <div className="legend">
                    <p className="marker" style={{ color: 'blue' }}>-</p>
                    <p>human</p>
                    <p className="marker" style={{ color: 'green', marginLeft: '10px' }}>-</p>
                    <p>openpilot</p>
                </div>}
            </div>
        </div>
    </div>
}

export default Visuals;
