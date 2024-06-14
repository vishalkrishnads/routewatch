import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { getDevice } from '../../db';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlzaGFsZHMiLCJhIjoiY2x1YXRrdnpzMGw5aDJucWs4enpkamdsZCJ9.eCkROwVcGTpatN-PKhQ86w';

export default function Map({ routes }) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const layers = useRef([]);

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

        changeTheme(themeMediaQuery);

        themeMediaQuery.addEventListener('change', changeTheme);
        return () => themeMediaQuery.removeEventListener('change', changeTheme);
    }, []);

    const clear = () => {
        layers.current.forEach((item, index) => {
            for (let i = 0; i < item; i++) {
                const engagement = `engagement-${index}-${i}`;
                if (map.current.getLayer(engagement)) {
                    map.current.removeLayer(engagement)
                    map.current.removeSource(engagement)
                }
            }
            const route = `route-${index}`
            if (map.current.getLayer(route)) {
                map.current.removeLayer(route)
                map.current.removeSource(route)
            }
        })

        layers.current = [];
    }

    const addSource = (id, coords) => {
        map.current.addSource(id, {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coords
                }
            }
        });
    }

    const addLayer = (id, color) => {
        map.current.addLayer({
            id,
            type: 'line',
            source: id,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': color,
                'line-width': 5
            }
        });
    }

    const drawRoute = (route, id) => {
        if (!map.current) return;

        addSource(`route-${id}`, route.map((item) => {
            return [item.lng, item.lat];
        }));

        addLayer(`route-${id}`, '#0000ff');

        let engagements = [], engagement = [];
        for (let i = 0; i < route.length; i++) {
            if ('status' in route[i] && route[i].status === 'engaged') {
                engagement.push([route[i].lng, route[i].lat]);
            }
            if (i === route.length - 1 || !('status' in route[i + 1])) {
                if (engagement.length > 0) {
                    engagements.push(engagement);
                    engagement = [];
                }
            }
        }

        engagements.forEach((item, index) => {
            addSource(`engagement-${id}-${index}`, item);
            addLayer(`engagement-${id}-${index}`, 'green')
        })

        map.current.flyTo({
            center: [route[0].lng, route[0].lat],
            essential: true,
            zoom: 13
        })

        layers.current.push(engagements.length);
    };

    useEffect(() => {
        clear();
        if (routes && routes.length > 0) {
            console.log(routes)
            routes.forEach((item, index) => {
                drawRoute(item, index);
            })
        }
    }, [routes]);

    return (
        <div ref={mapContainer} className="map" />
    );
}