import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression, LeafletEvent } from "leaflet";
import "leaflet-editable";
import { useEffect } from "react";

const polyline: LatLngExpression[] = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12],
];

function App() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh" }}
      editable={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={polyline} />

      <RegisterEditableEvents />
      <DrawPolylineButton />
    </MapContainer>
  );
}

export default App;

// RegisterEditableEvents
function RegisterEditableEvents() {
  const map = useMap();

  useEffect(() => {
    if (!map || !map.editTools) return;

    const onDrawingStart = (e: LeafletEvent) => {
      console.log("✏️ Disegno iniziato", e);
    };
    const onDrawingEnd = (e: LeafletEvent) => {
      console.log("✅ Disegno completato", e);
    };
    const onEditing = (e: LeafletEvent) => {
      console.log("🛠️ In editing", e);
    };

    map.on("editable:editing", onEditing);
    map.on("editable:drawing:start", onDrawingStart);
    map.on("editable:drawing:end", onDrawingEnd);

    // cleanup
    return () => {
      map.off("editable:editing", onEditing);
      map.off("editable:drawing:start", onDrawingStart);
      map.off("editable:drawing:end", onDrawingEnd);
    };
  }, [map]);

  return null;
}

// DrawPolylineButton
function DrawPolylineButton() {
  const map = useMap();

  const startDrawing = () => {
    map.editTools.startPolyline();
  };

  return (
    <button
      onClick={startDrawing}
      style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}
    >
      Disegna Polilinea
    </button>
  );
}
