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