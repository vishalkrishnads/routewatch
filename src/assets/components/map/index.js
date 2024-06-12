import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { getDevice } from '../../db';
import { getRoutes } from '../../api';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlzaGFsZHMiLCJhIjoiY2x1YXRrdnpzMGw5aDJucWs4enpkamdsZCJ9.eCkROwVcGTpatN-PKhQ86w';

export default function Map({ date }) {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return; // initialize map only once

        try {
            const { coords } = getDevice();
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/dark-v11',
                center: [coords.latitude, coords.longitude],
                zoom: 12
            });
        } catch { return; }

        const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const changeTheme = (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            map.current.setStyle(`mapbox://styles/mapbox/${newTheme}-v11`)
        };

        themeMediaQuery.addEventListener('change', changeTheme);
        return () => themeMediaQuery.removeEventListener('change', changeTheme);
    }, []);

    useEffect(() => {
        if (date.from && date.to) {
           getRoutes(date)
        }
    }, [date.from, date.to])

    return (
        <div ref={mapContainer} className="map" />
    );
}