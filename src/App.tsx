import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import "leaflet-editable";
import LeafletEditTools from "./LeafletEditTools/LeafletEditTools";
import LeafletEditTools2 from "./LeafletEditTools/LeafletEditTools2";
import LeafletEditTools3 from "./LeafletEditTools/LeafletEditTools3";

const polygons: LatLngExpression[][] = [
  [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
    [51.505, -0.11],
  ],
  [
    [51.51, -0.08],
    [51.515, -0.09],
    [51.515, -0.11],
    [51.51, -0.1],
  ],
];

function App() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={14}
      style={{ height: "100vh" }}
      editable={true}
    >
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}

      {/* <LeafletEditTools polygons={polygons} /> */}
      {/* <LeafletEditTools2 /> */}
      <LeafletEditTools3>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polygons.map((polygon, index) => (
          <Polygon key={`polygon-${index}`} positions={polygon} />
        ))}
      </LeafletEditTools3>
    </MapContainer>
  );
}

export default App;
