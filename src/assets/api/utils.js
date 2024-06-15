// copied straight from comma connect
// TODO: remove unnecessary stuff like override, flag, etc to speed up processing
export function parseEvents(route, driveEvents) {
    // sort events
    driveEvents.sort((a, b) => {
        if (a.route_offset_millis === b.route_offset_millis) {
            return a.route_offset_nanos - b.route_offset_nanos;
        }
        return a.route_offset_millis - b.route_offset_millis;
    });

    // create useful drive events from data
    let res = [];
    let currEngaged = null;
    let currAlert = null;
    let currOverride = null;
    let lastEngage = null;
    let currFlag = null;
    for (const ev of driveEvents) {
        if (ev.type === 'state') {
            if (currEngaged !== null && !ev.data.enabled) {
                currEngaged.data.end_route_offset_millis = ev.route_offset_millis;
                currEngaged = null;
            }
            if (currEngaged === null && ev.data.enabled) {
                currEngaged = {
                    ...ev,
                    data: { ...ev.data },
                    type: 'engage',
                };
                res.push(currEngaged);
            }

            if (currAlert !== null && ev.data.alertStatus !== currAlert.data.alertStatus) {
                currAlert.data.end_route_offset_millis = ev.route_offset_millis;
                currAlert = null;
            }
            if (currAlert === null && ev.data.alertStatus !== 'normal') {
                currAlert = {
                    ...ev,
                    data: { ...ev.data },
                    type: 'alert',
                };
                res.push(currAlert);
            }

            if (currOverride !== null && ev.data.state !== currOverride.data.state) {
                currOverride.data.end_route_offset_millis = ev.route_offset_millis;
                currOverride = null;
            }
            if (currOverride === null && ['overriding', 'preEnabled'].includes(ev.data.state)) {
                currOverride = {
                    ...ev,
                    data: { ...ev.data },
                    type: 'overriding',
                };
                res.push(currOverride);
            }
        } else if (ev.type === 'engage') {
            lastEngage = {
                ...ev,
                data: { ...ev.data },
            };
            res.push(lastEngage);
        } else if (ev.type === 'disengage' && lastEngage) {
            lastEngage.data = {
                end_route_offset_millis: ev.route_offset_millis,
            };
        } else if (ev.type === 'alert') {
            res.push(ev);
        } else if (ev.type === 'event') {
            res.push(ev);
        } else if (ev.type === 'user_flag') {
            currFlag = {
                ...ev,
                data: {
                    ...ev.data,
                    end_route_offset_millis: ev.route_offset_millis + 1e3,
                },
                type: 'flag',
            };
            res.push(currFlag);
        }
    }

    // make sure events have an ending
    if (currEngaged !== null) {
        currEngaged.data.end_route_offset_millis = route.duration;
    }
    if (currAlert !== null) {
        currAlert.data.end_route_offset_millis = route.duration;
    }
    if (currOverride !== null) {
        currOverride.data.end_route_offset_millis = route.duration;
    }
    if (lastEngage && lastEngage.data?.end_route_offset_millis === undefined) {
        lastEngage.data = {
            end_route_offset_millis: route.duration,
        };
    }

    // reduce size, keep only used data
    res = res.map((ev) => ({
        type: ev.type,
        route_offset_millis: ev.route_offset_millis,
        data: {
            state: ev.data.state,
            event_type: ev.data.event_type,
            alertStatus: ev.data.alertStatus,
            end_route_offset_millis: ev.data.end_route_offset_millis,
        },
    }));

    return res;
}

// utility function to annotate the gps path with driving state
// it takes in as args the path and events, and for every path point between the start & end time of an engage event,
// annotates that gps path with status engaged, so that the map can simply plot the data.
export function annotateCoords(coords, events) {
    for (const event of events) {
        const start = Math.round(event.route_offset_millis / 1000), end = Math.round(event.data.end_route_offset_millis / 1000);
        if (start && end) {
            coords.forEach(obj => {
                if (obj.t >= start && obj.t <= end) {
                    obj.status = 'engaged';
                }
            });
        }
    }

    return coords;
}
