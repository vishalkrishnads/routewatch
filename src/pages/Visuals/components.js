import { useState, useEffect } from "react";
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

export const DatePicker = ({ position, onSelect, date }) => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        const newDateValue = event.target.value;

        // extract the date from the ISO string
        setSelectedDate(newDateValue.split('T')[0]);
        if (newDateValue) {
            // and get time since last unix epoch
            const dateUTCString = new Date(newDateValue).getTime();
            onSelect(position === 'from' ? { ...date, from: dateUTCString } : { ...date, to: dateUTCString });
        } else {
            onSelect(position === 'from' ? { ...date, from: null } : { ...date, to: null });
        }
    };

    useEffect(() => {
        const timestamp = position === 'from' ? date.from : date.to;
        if(timestamp) setSelectedDate(new Date(timestamp).toISOString().split('T')[0]);
        // eslint-disable-next-line
    }, [date])

    return (
        <div className={`date ${position}`}>
            <p>{position}</p>
            <input
                className="value"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
            />
        </div>
    );
};

export const DisengageFrame = ({ url, onRequestClose }) => {
    return <div className="modal">
        {url && <div onClick={onRequestClose} className="background" />}
        {url && <div className="content">
            <div className="header">
                <div className="action" />
                <div className="title">
                    <h3>Saturday June 29, 2023</h3>
                </div>
                <div className="action">
                    <div onClick={onRequestClose} className="button">
                        <CloseIcon />
                    </div>
                </div>
            </div>
            <div className="image">
                <img src={url} alt={'Frame captured closest to disengagement'} />
            </div>
            <div className="footer">
                <InfoIcon />
                <p>nearest available images of the event</p>
            </div>
        </div>}
    </div>
}
