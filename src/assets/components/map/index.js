/*
    The map component that plots the visualizations for a given annotated route.
    It takes in as arg routes: a 2D array containing routes of different drives as elements.
    And for each route in the routes, plots it in the map.
    Initially, all the routes are plotted in a color, and then
    the parts driven by openpilot are plotted with a different color on top
*/

import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { getDevice } from '../../db';
import { CONFIGS } from '../../config';

mapboxgl.accessToken = CONFIGS.MAPBOX;

export default function Map({ routes }) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const layers = useRef([]); // used to keep track of the plots made in the map

    useEffect(() => {
        if (map.current) return;

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
            map.current.setStyle(`mapbox://styles/mapbox/${newTheme}-v11`);
        };

        changeTheme(themeMediaQuery);

        themeMediaQuery.addEventListener('change', changeTheme);
        return () => themeMediaQuery.removeEventListener('change', changeTheme);
    }, []);

    // utility function to clear all the routes plotted in the map previously
    const clear = () => {
        // it iterates over each element in the layers array
        layers.current.forEach((item, index) => {
            // and clears all the openpilot drive plots assoicated with the route
            for (let i = 0; i < item; i++) {
                const engagement = `engagement-${index}-${i}`;
                if (map.current.getLayer(engagement)) {
                    map.current.removeLayer(engagement);
                    map.current.removeSource(engagement);
                }
            }
            //and then clears the plot of that route itself.
            const route = `route-${index}`
            if (map.current.getLayer(route)) {
                map.current.removeLayer(route);
                map.current.removeSource(route);
            }
        })
        // finally, the layers array itself is cleared for future use
        layers.current = [];
    }

    // utility function to add a source
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

    // utility function to add a layer
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

    // utility function to draw a single route
    const drawRoute = (route, id) => {
        if (!map.current) return;

        // initially, plot the whole route
        addSource(`route-${id}`, route.map((item) => {
            return [item.lng, item.lat];
        }));
        addLayer(`route-${id}`, '#0000ff');

        // create a list of engagements from the supplied route
        let index = 0, engagement = [];
        for (let i = 0; i < route.length; i++) {
            // if this part was engaged, then add it to the current engagement
            if ('status' in route[i] && route[i].status === 'engaged') {
                engagement.push([route[i].lng, route[i].lat]);
            }
            // if the next one is not, then mark this engagement as done and plot it
            if (i === route.length - 1 || !('status' in route[i + 1])) {
                if (engagement.length > 0) {
                    addSource(`engagement-${id}-${index}`, engagement);
                    addLayer(`engagement-${id}-${index}`, 'green');
                    engagement = [];
                    index++;
                }
            }
        }

        // and fly the map to the first coordinate
        map.current.flyTo({
            center: [route[0].lng, route[0].lat],
            essential: true,
            zoom: 13
        })

        // mark this layer for clearing in the future
        layers.current.push(index);
    };

    useEffect(() => {
        clear();
        if (routes && routes.length > 0) {
            routes.forEach((item, index) => {
                drawRoute(item, index);
            })
        }
        // eslint-disable-next-line
    }, [routes]);

    return (
        <div ref={mapContainer} className="map" />
    );
}