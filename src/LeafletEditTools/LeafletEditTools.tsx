// import type { Map } from "leaflet";
import type {
  LatLngExpression,
  Layer,
  LeafletEvent,
  LayerGroup,
} from "leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { Polygon, useMap } from "react-leaflet";
import "leaflet-editable";

interface LeafletEditToolsProps {
  polygons?: LatLngExpression[][];
}

const LeafletEditTools = ({ polygons = [] }: LeafletEditToolsProps) => {
  const map = useMap();

  const [selectedPolygon, setSelectedPolygon] = useState<{
    polygon: LatLngExpression[] | null;
    layerId: number | null;
  }>({ polygon: null, layerId: null });

  // Create a LayerGroup to hold the polygons
  const polygonLayerGroup = useRef<LayerGroup | null>(null);

  useEffect(() => {
    if (!map || !map.editTools) return;

    // Inizializza il LayerGroup se non esiste
    if (!polygonLayerGroup.current) {
      polygonLayerGroup.current = L.layerGroup();
      polygonLayerGroup.current.addTo(map);
    }

    // Setup eventi Leaflet.Editable
    if (map.editTools) {
      const onDrawingEnd = (e: LeafletEvent) => {
        console.log("✅ Disegno completato", e);
        // Aggiungi automaticamente il nuovo layer al gruppo
        if (e.layer && polygonLayerGroup.current) {
          polygonLayerGroup.current.addLayer(e.layer);
        }
      };

      map.on("editable:drawing:end", onDrawingEnd);
      return () => {
        map.off("editable:drawing:end", onDrawingEnd);
      };
    }
  }, [map]);

  // Aggiungi i poligoni iniziali al LayerGroup
  const addLayerToGroup = (layer: Layer) => {
    if (polygonLayerGroup.current) {
      polygonLayerGroup.current.addLayer(layer);
    }
  };

  // Funzione per avviare l'editing del poligono selezionato
  const startEditing = () => {
    if (
      !selectedPolygon.layerId ||
      !map ||
      !map.editTools ||
      !polygonLayerGroup.current
    ) {
      console.warn("Condizioni per l'editing non soddisfatte");
      return;
    }
    const layer = polygonLayerGroup.current.getLayer(selectedPolygon.layerId);
    // console.log("Layer trovato:", layer);
    if (layer && layer instanceof L.Polygon) {
      // Verifica che il layer abbia le funzionalità di editing
      layer.enableEdit();
      //   console.log("✏️ Editing abilitato per layer:", selectedPolygon.layerId);
    }
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: "300px",
          height: "90%",
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "10px",
          gap: "10px",
        }}
      >
        <h2 style={{ alignSelf: "center" }}>Leaflet Edit Tools</h2>

        <button onClick={() => map.editTools.startPolygon()} style={{}}>
          Disegna Poligono
        </button>
        <button
          onClick={startEditing}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          ✏️ Modifica Poligono
        </button>
      </div>
      {polygons.map((polygon, index) => (
        <Polygon
          key={index}
          positions={polygon}
          eventHandlers={{
            add: (leafletEvent: LeafletEvent) => {
              addLayerToGroup(leafletEvent.target);
            },
            click: (leafletEvent: LeafletEvent) => {
              setSelectedPolygon({
                polygon: polygon,
                layerId: leafletEvent.target._leaflet_id,
              });
            },
          }}
          pathOptions={{
            color: selectedPolygon.polygon === polygon ? "red" : "blue",
          }}
        />
      ))}
    </>
  );
};

export default LeafletEditTools;
