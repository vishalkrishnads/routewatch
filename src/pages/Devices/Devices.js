/*
    Device selection page that lets users select from one of their paried comma devices.
    This page includes logic for:
        * switching user account
        * fetching and displaying a list of paired devices from /v1/me/devices
        * handling device selection
    Once a user has logged in, this page will be loaded on subsequent visits.
    If this detects that the account has been removed, it redirects to the account selection page
*/

import { useEffect, useState } from "react";
import { devices } from "@commaai/api";
import { useNavigate } from "react-router-dom";
import { addDevices, clearDB, getAccount, getDevices, hasAccount, setDevice } from "../../assets/db";
import { CONFIGS } from '../../assets/config';
import Greeting from "../../assets/components/greeting";
import Loader from "../../assets/components/loader";
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import StayCurrentLandscapeIcon from '@mui/icons-material/StayCurrentLandscape';
import AndroidIcon from '@mui/icons-material/Android';
import './styles.css'

const Devices = () => {

    const [status, setStatus] = useState('loading your devices');
    const [user, setUser] = useState('');
    const [avlDevices, setDevices] = useState([]);
    const navigate = useNavigate();

    const Device = ({ name, type, id, coords }) => {
        const icons = {
            'neo': <DeveloperBoardIcon fontSize="large" />,
            'eon': <StayCurrentLandscapeIcon fontSize="large" />,
            'threex': <StayCurrentLandscapeIcon fontSize="large" />,
            'app': <AndroidIcon fontSize="large" />
        }
        return <div onClick={() => {
            setDevice({ id, coords });
            navigate(CONFIGS.ROUTES.VISUALS);
        }} className="device">
            <div className="icon">{icons[type]}</div>
            <div className="name">
                <p id="name">{name}</p>
                <p id="type">{type}</p>
            </div>
        </div>
    }

    const switchAccount = () => {
        clearDB();
        navigate(CONFIGS.ROUTES.ACCOUNT);
    }

    useEffect(() => {
        if (!hasAccount()) switchAccount();
        else {
            let { username } = getAccount();
            if (username != null) setUser(username);
            devices.listDevices()
                .then(res => {
                    let list = [];
                    for (const each of res) {
                        list.push({ name: each.alias, type: each.device_type, id: each.dongle_id, coords: { latitude: each.last_gps_lat || -117.1611, longitude: each.last_gps_lng || 32.7157 } })
                    }
                    setDevices(list);
                    addDevices(list);
                    setStatus('');
                }).catch(() => setDevices(getDevices()))
        }
        // eslint-disable-next-line
    }, [])

    return <div className="body">
        <div className="border" />

        {status ?
            <div className="content">
                <Loader info={status} />
            </div>
            :
            <div className="content">
                <Greeting head={`hey there ${user}`} caption={'select a device linked to your account'} />

                <div className="devices">
                    {avlDevices.map((item, index) => {
                        return <Device key={index} id={item.id} coords={item.coords} name={item.name} type={item.type} />
                    })}
                </div>
                <div className="button">
                    <button onClick={switchAccount}>Switch account</button>
                </div>
            </div>}

        <div className="border footer">
            <p>with love from india</p>
            <a href={CONFIGS.GIT_REPO} >source code</a>
        </div>
    </div>
}

export default Devices;
