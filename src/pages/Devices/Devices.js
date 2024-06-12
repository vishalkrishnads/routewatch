import { useEffect, useState } from "react";
import { devices } from "@commaai/api";
import { useNavigate } from "react-router-dom";
import Greeting from "../../assets/components/greeting";
import Loader from "../../assets/components/loader";
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import StayCurrentLandscapeIcon from '@mui/icons-material/StayCurrentLandscape';
import AndroidIcon from '@mui/icons-material/Android';
import { addDevices, getAccount, getDevices, setDevice } from "../../assets/db";
import './styles.css'

const Devices = () => {

    const [status, setStatus] = useState('loading your devices')
    const [user, setUser] = useState('')
    const [avlDevices, setDevices] = useState([])
    const navigate = useNavigate();

    const Device = ({ name, type, id, coords }) => {
        const icons = {
            'neo': <DeveloperBoardIcon fontSize="large" />,
            'eon': <StayCurrentLandscapeIcon fontSize="large" />,
            'threex': <StayCurrentLandscapeIcon fontSize="large" />,
            'app': <AndroidIcon fontSize="large" />
        }
        return <div onClick={() => {
            console.log(coords)
            setDevice({ id, coords })
            navigate('/')
        }} class="device">
            <div class="icon">{icons[type]}</div>
            <div class="name">
                <p id="name">{name}</p>
                <p id="type">{type}</p>
            </div>
        </div>
    }

    useEffect(() => {
        let { username } = getAccount();
        if(username != null) setUser(username)
        devices.listDevices()
            .then(res => {
                let list = []
                for (const each of res) {
                    list.push({ name: each.alias, type: each.device_type, id: each.dongle_id, coords: { latitude: each.last_gps_lat || -117.1611, longitude: each.last_gps_lng || 32.7157 } })
                }
                setDevices(list)
                addDevices(list)
                setStatus('')
            }).catch(() => setDevices(getDevices()))
    }, [])

    return <div className="body">
        <div className="border" />

        {status ?
            <div className="content">
                <Loader info={status} />
            </div>
            :
            <div class="content">
                <Greeting head={`hey there ${user}`} caption={'select a device linked to your account'} />

                <div class="devices">
                    {avlDevices.map((item, index) => {
                        return <Device key={index} id={item.id} coords={item.coords} name={item.name} type={item.type} />
                    })}
                </div>
            </div>}

        <div class="border footer">
            <p>with love from india</p>
            <a href="https://github.com/vishalkrishnads/routewatch">source code</a>
        </div>
    </div>
}

export default Devices;
