import { drives } from '@commaai/api';
import { getDevice } from '../db';

export function getRoutes(date) {

    const { id } = getDevice();

    drives.getRoutesSegments(id, date.from, date.to)
        .then(segments => {

            // fix up the routes
            // taken straight from comma connect
            const routes = segments.map((r) => {
                let startTime = r.segment_start_times[0];
                let endTime = r.segment_end_times[r.segment_end_times.length - 1];

                if ((Math.abs(r.start_time_utc_millis - startTime) > 24 * 60 * 60 * 1000)
                    && (Math.abs(r.end_time_utc_millis - endTime) < 10 * 1000)) {
                    console.log('fixing %s', r.fullname);
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

            for (const route of routes) {
                fetch(`${route.url}/0/coords.json`)
                    .then(res => res.json())
                    .then(res => console.log(res))
            }
        })
}