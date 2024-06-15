/*
    All the API's exposed as JavaScript methods for the UI.
*/

import { drives } from '@commaai/api';
import { getDevice } from '../db';
import { get } from './network';
import { annotateCoords, parseEvents } from './utils';

// utility function to get the drive events
function getEvents(url, index) {
    return get(`${url}/${index}/events.json`);
}

// utility function to get the GPS path
function getCoords(url, index) {
    return get(`${url}/${index}/coords.json`);
}

export async function getRoutes(date) {

    const { id } = getDevice();

    try {
        let segments = await drives.getRoutesSegments(id, date.from, date.to);

        // eslint-disable-next-line
        if (segments == []) return [];

        // fix up the routes
        // taken straight from comma connect
        const routes = segments.map((r) => {
            let startTime = r.segment_start_times[0];
            let endTime = r.segment_end_times[r.segment_end_times.length - 1];

            if ((Math.abs(r.start_time_utc_millis - startTime) > 24 * 60 * 60 * 1000)
                && (Math.abs(r.end_time_utc_millis - endTime) < 10 * 1000)) {
                startTime = r.start_time_utc_millis;
                endTime = r.end_time_utc_millis;
                r.segment_start_times = r.segment_numbers.map((x) => startTime + (x * 60 * 1000));
                r.segment_end_times = r.segment_numbers.map((x) => Math.min(startTime + ((x + 1) * 60 * 1000), endTime));
            }
            return {
                ...r,
                url: r.url.replace('chffrprivate.blob.core.windows.net', 'chffrprivate.azureedge.net'),
                duration: endTime - startTime,
                start_time_utc_millis: startTime,
                end_time_utc_millis: endTime,
            };
        });

        const coords = routes.map(async (route) => {
            let driveEvents, coords;
            const eventPromises = [], coordsPromises = [];

            // for each route driven,
            for (let i = 0; i <= route.maxqlog; i++) {
                // get all the events that happened
                eventPromises.push((async (j) => {
                    return await getEvents(route.url, j);
                })(i));
                // and the gps path
                coordsPromises.push((async (j) => {
                    return await getCoords(route.url, j);
                })(i));
            }

            try {
                driveEvents = [].concat(...(await Promise.all(eventPromises)));
                coords = (await Promise.all(coordsPromises)).flat();
            } catch (err) {
                console.error(err);
                return [];
            }

            // parse the events using the function copied from comma connect
            // and filter out only the engagement events
            driveEvents = parseEvents(route, driveEvents).filter(event => event.type === 'engage');
            // include the date of the drive and the annotated coords
            return { date: route.start_time, coords: annotateCoords(coords, driveEvents) };
        })

        return await Promise.all(coords);
    } catch (e) {
        console.error(e)
        return [];
    }
}