import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
// beautify the marker of POIs.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function HeatLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const sortedPoints = [...points].sort((a, b) => b.viewCount - a.viewCount);

    const heatData = sortedPoints.map((item, index) => {
      let weight = 0.4; // mặc định cho ngoài top 5, đậm hơn một chút

      if (index === 0) weight = 1.0;
      else if (index === 1) weight = 0.88;
      else if (index === 2) weight = 0.76;
      else if (index === 3) weight = 0.64;
      else if (index === 4) weight = 0.5;

      return [item.latitude, item.longitude, weight];
    });

    const heatLayer = L.heatLayer(heatData, {
      radius: 28,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.35,
      gradient: {
        0.2: "#4c6ef5",  // xanh dương
        0.4: "#22c55e",  // xanh lá
        0.6: "#facc15",  // vàng
        0.8: "#f97316",  // cam
        1.0: "#dc2626",  // đỏ đậm
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const bounds = L.latLngBounds(
      points.map((item) => [item.latitude, item.longitude])
    );

    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, points]);

  return null;
}

function TopPoiMarkers({ points }) {
  // const topPoints = [...points]
  //   .sort((a, b) => b.viewCount - a.viewCount)
  //   .slice(0, 5);

  return (
    <>
      {points.map((item) => (
        <Marker
          key={item.poiId}
          position={[item.latitude, item.longitude]}
        >
          <Popup>
            <div>
              <strong>{item.name}</strong>
              <br />
              Views (7 days): {item.viewCount}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function HeatmapMap({ points = [] }) {
  const defaultCenter =
    points.length > 0
      ? [points[0].latitude, points[0].longitude]
      : [10.7769, 106.7009];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "16px" }}
      scrollWheelZoom={true}
    >
        <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer points={points} />
        <FitBounds points={points} />
        <TopPoiMarkers points={points} />
    </MapContainer>
  );
}