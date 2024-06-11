import { useState } from "react";
import Greeting from "../../assets/components/greeting";
import './styles.css'
import Loader from "../../assets/components/loader";

const Devices = () => {

    const [status, setStatus] = useState('loading your devices')
    const [devices, setDevices] = useState([])

    const Device = ({ name, type }) => {
        const icons = { 'neo': 'developer_board', 'eon': 'stay_current_landscape', 'app': 'android' }
        return <div class="device">
            <div class="icon">
                <span class="material-icons">{icons[type]}</span>
            </div>
            <div class="name">
                <p id="name">{name}</p>
                <p id="type">{type}</p>
            </div>
        </div>
    }

    return <div className="body">
        <div class="border" />

        {status ?
            <div className="content">
                <Loader info={status} />
            </div>
            :
            <div class="content">
                <Greeting head={'Hey there geo'} caption={'select a device'} />

                <div class="devices">
                    {devices.map((item, index) => {
                        return <Device key={index} name={item.name} type={item.type} />
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
