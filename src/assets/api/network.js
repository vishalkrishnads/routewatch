/*
    Not everything seems to work in @commaai/api. For instance, I couldn't get an OK response from the API
    for the events.json or coords.json. It just returns a 404.
    These are just simple get() and post() methods for simplicity and abstraction
*/

export function get(url, headers = {}) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers
        })
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(error => reject(error))
    });
}

export function post(url, body = {}, headers = {}) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers,
            body
        })
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(error => reject(error))
    });
}