import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = 'pk.eyJ1IjoidmlzaGFsZHMiLCJhIjoiY2x1YXRrdnpzMGw5aDJucWs4enpkamdsZCJ9.eCkROwVcGTpatN-PKhQ86w';

export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [-74.5, 40],
            zoom: 9
        });

        const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const changeTheme = (e) => {
            const newTheme = e.matches ? 'dark' : 'light';
            map.current.setStyle(`mapbox://styles/mapbox/${newTheme}-v11`)
        };

        themeMediaQuery.addEventListener('change', changeTheme);
        return () => themeMediaQuery.removeEventListener('change', changeTheme);
    }, []);

    return (
        <div ref={mapContainer} className="map" />
    );
}