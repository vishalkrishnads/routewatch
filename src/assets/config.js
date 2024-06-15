export const CONFIGS = {
    ROUTES: {
        ACCOUNT: '/account',
        DEVICE: '/device',
        VISUALS: '/'
    },
    // there is no point placing this in an .env file, because upon building, this will be embedded in the final build file
    // the challenge explicitly states that the app must be hosted with github pages, which doesn't have a server env
    // this seems to be the only way
    MAPBOX: 'pk.eyJ1IjoidmlzaGFsZHMiLCJhIjoiY2x1YXRrdnpzMGw5aDJucWs4enpkamdsZCJ9.eCkROwVcGTpatN-PKhQ86w',
    DEFAULT_ACCOUNT: {
        TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDg1ODI0NjUsIm5iZiI6MTcxNzA0NjQ2NSwiaWF0IjoxNzE3MDQ2NDY1LCJpZGVudGl0eSI6IjBkZWNkZGNmZGYyNDFhNjAifQ.g3khyJgOkNvZny6Vh579cuQj1HLLGSDeauZbfZri9jw',
        DATES: {
            START: 1686528000000,
            END: 1718236800000
        }
    },
    GIT_REPO: 'https://github.com/vishalkrishnads/routewatch'
}