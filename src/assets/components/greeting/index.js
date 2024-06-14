import { useEffect, useState } from 'react';

const Greeting = ({ head, caption }) => {
    
    const [isDark, setTheme] = useState(true);

    useEffect(() => {
        const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const changeTheme = (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            setTheme(newTheme === 'dark');
        };

        changeTheme(themeMediaQuery);

        themeMediaQuery.addEventListener('change', changeTheme);
        return () => themeMediaQuery.removeEventListener('change', changeTheme);
    }, [])

    return <>
        <img
            src={isDark ? require('../../img/dark.jpg') : require('../../img/light.jpg')}
            id="logo"
            alt="comma.ai"
            style={{ width: '150px', height: '150px' }}
        />
        <h2 style={{ marginBlock: '0em' }}>{head}</h2>
        <p style={{ marginBlock: '0.5em' }}>{caption}</p>
    </>
}

export default Greeting;
