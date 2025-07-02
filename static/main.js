// Configuration
const API_URL = "/transports";
const BATTERY_THRESHOLDS = [30, 70];
const STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" };
const ICON_VARIANTS = ["velo", "velo_new", "velo_broke"];

// Utility: create Leaflet icons dynamically
const createIcon = (variant, battery) => {
  const level =
    battery <= BATTERY_THRESHOLDS[0]
      ? "0"
      : battery <= BATTERY_THRESHOLDS[1]
      ? "50"
      : "100";
  const name = `static/${variant}${level}.png`;
  return L.icon({
    iconUrl: name,
    iconSize: [35, 39],
    iconAnchor: [17, 5],
  });
};

// Fetch wrapper
const makeRequest = async (url, method = "GET", payload = {}) => {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// Relative time formatting
const getRelativeTimeString = (timestamp, locale = navigator.language) => {
  const delta = Math.round((timestamp - Date.now()) / 1000);
  const units = [
    { limit: 60, name: "second" },
    { limit: 3600, name: "minute" },
    { limit: 86400, name: "hour" },
    { limit: 86400 * 7, name: "day" },
    { limit: 86400 * 30, name: "week" },
    { limit: 86400 * 365, name: "month" },
    { limit: Infinity, name: "year" },
  ];
  const unit = units.find((u) => u.limit > Math.abs(delta));
  const divisor =
    units.indexOf(unit) > 0 ? units[units.indexOf(unit) - 1].limit : 1;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return rtf.format(Math.floor(delta / divisor), unit.name);
};

// Initialize map
const map = L.map("map", {
  minZoom: 5,
  zoom: 15,
  center: [55.733506, 37.730911],
  attributionControl: false,
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);
L.control
  .locate({
    initialZoomLevel: 17,
    locateOptions: { enableHighAccuracy: true },
  })
  .addTo(map);

// Marker cluster group
const transportMarkers = L.markerClusterGroup({
  maxClusterRadius: 30,
}).addTo(map);

// Reload transports on view change
const reloadTransports = async () => {
  try {
    const bounds = map.getBounds();
    const data = await makeRequest(API_URL, "POST", {
      northEast: bounds.getNorthEast(),
      southWest: bounds.getSouthWest(),
    });

    transportMarkers.clearLayers();

    data.forEach((t) => {
      const {
        batteryPower: batt,
        frameNumber: id,
        operativeStatus,
        deviceType,
        mainCoordinate,
      } = t;
      const { latitude: lat, longitude: lng, ts } = mainCoordinate;

      const isInactive =
        operativeStatus === STATUS.INACTIVE || (Date.now() - ts) / 1000 > 1800;
      const variant = isInactive
        ? "velo_broke"
        : deviceType === "OMNI_IOT_DEVICE"
        ? "velo_new"
        : "velo";

      const icon = createIcon(variant, batt);
      const relTime = getRelativeTimeString(ts);

      const popup = L.popup().setContent(`
        🚲 <strong style="color:#e19101;cursor:pointer;" data-id="${id}">${id}</strong><br>
        ⚡ ${batt}%<br>
        <em style="color:#999;font-size:1em;">${relTime}</em>
        ${
          isInactive
            ? ""
            : `<a href="tg://resolve?domain=hotstonebot&start=${id}" class="btn-rent">АРЕНДОВАТЬ</a>`
        }
      `);

      const marker = L.marker([lat, lng], {
        icon,
        title: `${batt}%`,
      }).bindPopup(popup);

      marker.on("popupopen", () => {
        const span = popup.getElement().querySelector("[data-id]");
        span?.addEventListener("click", () =>
          navigator.clipboard.writeText(id)
        );
      });

      transportMarkers.addLayer(marker);
    });
  } catch (err) {
    console.error("Failed to load transports:", err);
  }
};

map.on("zoomend dragend", reloadTransports);
reloadTransports();
