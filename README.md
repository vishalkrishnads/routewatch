<img src="https://github.com/vishalkrishnads/routewatch/assets/50231856/a4d3dd70-9c0c-462a-8511-0e384ef45264" alt="comma.ai" width="200" align="right" >

# `routewatch` 🗺️
A web app that allows a comma device user to visualize their openpilot usage in an intuitive manner. I mean, what better intuition is there than to show them where they drove vs where openpilot drove! So, this website visualizes a user's openpilot usage with their driving routes. View the website [here](https://vishalkrishnads.github.io/routewatch). Don't have a comma device? That's okay, just use the demo account.

> :warning: This is my submission of the [comma web challenge](https://github.com/commaai/jobs/blob/master/web.md) hosted by [comma.ai](https://comma.ai) and not one of my projects.

## Table Of Contents
* [Problem Statement](#problem-statement)
    * [Functionality Required](#functionality-required)
    * [Constraints & Nuances](#constraints--nuances)
* [Implementation](#implementation)
    * [The UI](#the-ui)
    * [API & Communication](#api--communication)
* [Setup Guide](#setup-guide)
    * [Prerequisites](#prerequisites)
    * [Build from source](#build-from-source)
* [Contributing](#contributing)

## Problem Statement
The [challenge document](https://github.com/commaai/jobs/blob/master/web.md) says the following:
> openpilot logs all sorts of interesting data as one drives, including GPS, IMU measurements, 20fps 360° video, all the CAN from the car, and more. The goal is to build an interesting visualization for a user's openpilot routes. The deliverable is a GitHub repo with the project, plus a link to the GitHub Pages. The visualization can focus on any of the logged data; think anything from comma connect to Spotify Wrapped.

As I thought about it, what better data to show other than the driving statistics itself? After all, the progress of an ADAS/self-driving system can be best judged by how long it drives vs the driver. Moreover, I found that this visualization was missing from comma connect. So, it felt best to consider this the problem statement and solve it.

### Functionality Required
1. The app should allow any user to login by obtaining a user account token. Tokens can be obtained at [jwt.comma.ai](https://jwt.comma.ai).
2. For anyone not owning a comma device, there should be a demo account to see what this is.
3. A single user account can have multiple devices. The user should be able to select their preferred one to view.
4. Different drives occur at different dates. So, there needs to be a date range selector, just like in comma connect, to view the routes.
5. Once a date range is selected, the user should be able to switch between the available drives, as well as see them individually.

### Constraints & Nuances
1. No constraints have been mentioned, other than to keep the implementation simple.
2. One is allowed to use the [comma API](https://api.comma.ai) to build this.

## Implementation
The whole aim here is to keep the implementation simple, and I've tried to achieve it as much as possible. So, I have refrained from using stuff like Redux on top of react. It felt a bit overkill for this app and would take away the simplicity.

### A short backstory
This project started out as a vanilla HTML, CSS & JS web app in order to keep it really simple, without any of that JavaScript fraemwork jargon. But, I ran into a couple of issues with the API and had to abandon it. You see, the API docs aren't totally up-to-date yet. Initially, I tried to use simple JS `fetch()` to communicate with it. But, the browser complained that the server didn't return any valid CORS headers and was redirecting the OPTIONS preflight check request. Then, I came across the official [comma API client library](https://github.com/commaai/comma-api), which had a compiled `dist/` directory. But then again, I would have had to use node because it uses a node module called `query-string`. So, I settled on react after considering the following:

* comma connect itself is written in react with vite. so, it makes absolutely no sense that this is written in vanilla JS
* in a vanilla approach, everything would look a tad more complex, which is not exactly the kind of thing the challenge expects.

Thus, I scraped that work and started again. The old source can be found at my [routewatch-old](https://github.com/vishalkrishnads/routewatch-old) repo. None of the functionality works in it, because it has been impossible to get the API to respond without the client JS library.

### The UI
I took a monotone approach for the UI, without too much colors. The visualization sticks out because it's the only colored part in the UI. There are basically 3 pages:

1. Account selection: allows you to login with a comma account, using an account token obtained from [JWT](https://jwt.comma.ai).
2. Device selection: allows you to choose from one of your paired comma devices.
3. The visualization: lets you choose a date range and visualize your routes.

### API & Communication
Only data from the comma API has been used in this project. Some of the routes or responses weren't documented in the [API docs](https://github.com/commaai/comma-api/blob/master/openapi.yaml) or the [openapi.yaml](https://github.com/commaai/comma-api/blob/master/openapi.yaml) file in the `@commaai/api` module. As such, a combination of the module and JS `fetch()` has been used. Here are the API endpoints used in routewatch:

#### Account Login

> GET: `/v1/me`

🔗 [docs](https://api.comma.ai/#profile)

This route returns information about the authenticated user. Authentication is done using a token obtained from the user. You can obtain the token at [JWT](https://jwt.comma.ai/).

#### Get paired devices

> GET: `/v1/me/devices`

🔗 [docs](https://api.comma.ai/#devices)

This route returns a list of all the comma devices paired to the authenticated user account. A device can be either of `eon`, `neo`, `app` or `threex`.

#### Get route segments

> GET: `/v1/devices/:dongle_id/routes_segments

🔗 [docs](https://github.com/commaai/comma-api/blob/master/openapi.yaml#L474)

Accepts two parameters `to` & `from`, and returns a time-sorted list of route segments. These essentially indicate the drives. Thanks to @incognitojam for [pointing it out](https://github.com/commaai/comma-api/issues/31#issuecomment-2147183523).

#### GPS path

> GET: `https://chffrprivate.azureedge.net/....../index/coords.json`

🔗 [docs](https://api.comma.ai/#gps-path)

After openpilot uploads a log, a JSON array of GPS coordinates interpolated at 1hz is exposed at a signed URL in the cloud. THe URL is returned along with the response from the segments endpoint. This is used to plot the route in the map.

#### Driving Events

> GET: `https://chffrprivate.azureedge.net/....../index/events.json`

🔗 [docs](https://api.comma.ai/#events)

In each uploaded route, there will be driving events indicating when something happened. We can sense engagement and disengagement events from these events. comma connect uses this to plot the timeline in the video player, and routewatch uses the same in it's map.

## Setup Guide
If you want to view & use the application, you can simply visist the hosted version in github pages [here](https://vishalkrishnads.github.io/routewatch). But if you'd rather build & run from source, follow this guide.

### Prerequisites
Make sure these are installed and ready to go in your machine in order to build the application
1. Git: Download the installer for your platform from the [downloads page](https://www.git-scm.com/downloads) and run it. Alternatively, if you're on Linux, it'd mostly come pre-installed. Check by running `git` from terminal.
2. Node.js: Get the binary corresponding to your platform from the [downloads page](https://nodejs.org/en/download) & set it up. In Linux, `apt` installations may not work properly because it usually installs an older version.

### Build from source
Follow the steps below to clone and build the application

1. Clone this repository

    ```
    git clone https://github.com/vishalkrishnads/routewatch.git
    ```

2. Change working directory

    ```
    cd routewatch/
    ```

3. Install all the JavaScript dependencies

    ```
    npm install
    ```

4. Start the development server & the application using the Tauri CLI

    ```
    npm run dev
    ```

That's it! You'll see the app opened in your browser. Happy coding! 🎉

## Contributing
This repo isn't accepting any external contributions as of now. It should be obvious because this is my submission for a challenge. However, if you made it till here and want to contribute, I greatly appreciate it! Feel free to open a PR and I will merge it as the challenge finishes.
