/*
    The visualization page which lets users choose a date range and displays the route visualizations.
    This page includes logic for:
        * validating the dates and prompting the api
        * sorting data as requested by the user, ie, displaying individual routes or combined visualizations
        * displaying current operation status to the user
    This page is displayed as the default route. So, it also includes validation logic for checking if the user has logged in.
*/

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccount, hasAccount } from '../../assets/db';
import { getRoutes } from '../../assets/api';
import { CONFIGS } from '../../assets/config';
import { DatePicker, DisengageFrame } from './components';
import Map from '../../assets/components/map';
import Loader from '../../assets/components/loader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import './styles.css';

const Visuals = () => {

    const [status, setStatus] = useState({ message: '', icon: <Loader /> });
    const [popClass, setPop] = useState('');
    const [date, setDate] = useState({ from: null, to: null });
    const [isIndividual, setIndividual] = useState(true);
    const [drives, setDrives] = useState([]);
    const [drive, setDrive] = useState(0);
    const [frame, setFrame] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        // validate whether user has logged in
        if (!hasAccount()) navigate(CONFIGS.ROUTES.ACCOUNT);
        // set dates to default dates if it's the default account
        if (getAccount().token === CONFIGS.DEFAULT_ACCOUNT.TOKEN) setDate({ from: CONFIGS.DEFAULT_ACCOUNT.DATES.START, to: CONFIGS.DEFAULT_ACCOUNT.DATES.END })
        // eslint-disable-next-line
    }, [])

    // utility function for displaying a popup toast message
    // once done, simply invoke toast() to hide
    const toast = (message = '', icon = 'working') => {
        const icons = {
            'success': <CheckCircleIcon />,
            'error': <ErrorIcon />,
            'warning': <WarningIcon />,
            'working': <Loader />
        }

        const show = () => {
            setPop('pop-up'); // add class name for animation
            setStatus({ message, icon: icons[icon] }); // show the toast
        }

        const hide = () => {
            setPop('pop-down'); // set fade out animation class
            setStatus({ message: '', icon: <Loader /> });
            setTimeout(() => setPop(''), 1000) // wait a second and remove the animation class
        }

        // if no message, then the user has invoked toast(), so hide
        if (!message) {
            hide();
            return;
        }

        show();
    }

    const showFrame = async(index, segment) => { 
        const route = drives[index];
        setFrame(`${route.url}/${segment}/sprite.jpg`)
    }

    useEffect(() => {
        async function refresh() {
            if (date.from && date.to) {
                try {
                    toast('Fetching your drives...', 'working');
                    // get the routes for the specified date range
                    let routes = await getRoutes(date);
                    // set the display to the first route
                    setDrive(0);
                    // and keep the routes in memory
                    setDrives(routes);
                    if (routes.length > 0) toast('There you go!', 'success');
                    else toast('No drives in these dates.', 'warning')
                } catch (e) { toast(e.message, 'error'); }
                setTimeout(() => toast(), 1000);
            }
        }

        refresh();
    }, [date])

    // utility function to format a date in ISO to a human readable one
    function formatDate(isoDateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(isoDateString);
        return date.toLocaleDateString('en-US', options);
    }

    return <div className='body'>
        <Map
            routes={
                isIndividual ?
                    (drives.length > 0 && [drives[drive].coords])
                    : drives.map(item => item.coords)
            }
            onMarkerClick={(index, segment) => showFrame(index, segment)}
        />
        <DisengageFrame url={frame} onRequestClose={() => setFrame('')} />
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
