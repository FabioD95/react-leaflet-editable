import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet-editable";
import LeafletEditTools from "./LeafletEditTools/LeafletEditTools";

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
  // Funzione dimostrativa per salvare i poligoni
  const handleSavePolygons = async (polygonsData: L.LatLng[][]) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula un salvataggio asincrono
    console.log("Poligoni da salvare:", polygonsData);
  };

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={14}
      style={{ height: "100vh" }}
    >
      <LeafletEditTools onSavePolygons={handleSavePolygons}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {polygons.map((polygon, index) => (
          <Polygon key={`polygon-${index}`} positions={polygon} />
        ))}
      </LeafletEditTools>
    </MapContainer>
  );
}

export default App;
