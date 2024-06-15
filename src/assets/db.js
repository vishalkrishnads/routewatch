/*
    I didn't feel the need for any overkill using Redux or contexts for managing global states in this project.
    So, here we are with window.localStorage & window.sessionStroage.
    These are just utility functions for managing the app's global data.
*/

export function hasAccount() {
    return localStorage.getItem('creds') != null;
}

export function getAccount() {
    return JSON.parse(localStorage.getItem('creds'));
}

export function addAccount(token, username = '') {
    localStorage.setItem('creds', JSON.stringify({ token, username }));
}

export function removeAccount() {
    localStorage.removeItem('creds');
}

export function addDevices(devices) {
    localStorage.setItem('devices', JSON.stringify(devices))
}

export function getDevices() {
    return JSON.parse(localStorage.getItem('devices'))
}

export function setDevice(device) {
    sessionStorage.setItem('device', JSON.stringify(device))
}

export function getDevice() {
    return JSON.parse(sessionStorage.getItem('device'))
}

export function clearDB() {
    localStorage.clear();
}
