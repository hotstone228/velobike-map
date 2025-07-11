# ВЕЛОБАЙК - VELOBIKE MAP

A simple web map for visualizing Velobike (Moscow city bike) locations and statuses, using Leaflet and MarkerCluster. This project fetches live data and displays available bikes with battery and status info.

## Features

- Interactive map with real-time Velobike locations
- Marker clustering for better performance
- Battery and status icons for each bike
- Quick copy of bike ID and direct rent link (Telegram bot)
- Mobile-friendly UI

## Usage

1. Clone the repository:
   ```sh
   git clone https://github.com/hotstone228/velobike-map.git
   cd velobike-map
   ```
2. Open `index.html` in your browser.

## Project Structure

```
velobike-map/
├── index.html           # Main HTML file
├── static/
│   ├── main.js         # Main JavaScript logic
│   ├── favicon.ico     # Favicon
│   ├── velo*.png       # Bike icons (various statuses)
│   └── ...             # Other static assets
└── LICENSE
```

## Local Development

No build step is required. Just open `index.html` in your browser. For local development with fetch requests, you may need to run a local server:

```sh
# Python 3.x
python -m http.server 8000
# or
# Node.js (http-server)
npm install -g http-server
http-server -p 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

## Dependencies

- [Leaflet](https://leafletjs.com/)
- [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
- [Leaflet.LocateControl](https://github.com/domoritz/leaflet-locatecontrol)

All dependencies are loaded via CDN.

## Main Repository: Velobike Bot

This map is a companion project to the main Velobike bot repository:

- **Bot & Backend:** [hotstone228/velobike-bot](https://github.com/hotstone228/velobike-bot)

The bot provides rental, notifications, and backend API for Velobike. For full functionality and backend details, see the main repo above.

## License

MIT
