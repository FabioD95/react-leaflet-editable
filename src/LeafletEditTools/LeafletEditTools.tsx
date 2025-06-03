// import type { Map } from "leaflet";
import type {
  LatLngExpression,
  Layer,
  LeafletEvent,
  LayerGroup,
  EditableMixin,
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
    if (layer && layer instanceof L.Polyline) {
      // Verifica che il layer abbia le funzionalità di editing
      layer.enableEdit();
      //   console.log("✏️ Editing abilitato per layer:", selectedPolygon.layerId);
    }
  };

  // Funzione per fermare l'editing
  const stopEditing = () => {
    if (!selectedPolygon.layerId || !polygonLayerGroup.current) return;

    try {
      const layer = polygonLayerGroup.current.getLayer(selectedPolygon.layerId);

      if (layer && layer instanceof L.Polygon) {
        const editableLayer = layer as L.Polygon & EditableMixin;

        if (typeof editableLayer.disableEdit === "function") {
          editableLayer.disableEdit();
          console.log(
            "⏹️ Editing disabilitato per layer:",
            selectedPolygon.layerId
          );
        }
      }
    } catch (error) {
      console.error("Errore durante la disabilitazione dell'editing:", error);
    }
  };

  // Funzione per eliminare un poligono
  const deletePolygon = () => {
    if (!selectedPolygon.layerId || !polygonLayerGroup.current) return;

    try {
      const layer = polygonLayerGroup.current.getLayer(selectedPolygon.layerId);

      if (layer) {
        // Prima disabilita l'editing se attivo
        if (layer instanceof L.Polygon) {
          const editableLayer = layer as L.Polygon & EditableMixin;
          if (typeof editableLayer.disableEdit === "function") {
            editableLayer.disableEdit();
          }
        }

        // Rimuovi dal gruppo e dalla mappa
        polygonLayerGroup.current.removeLayer(selectedPolygon.layerId);
        setSelectedPolygon({ polygon: null, layerId: null });
        console.log("🗑️ Poligono eliminato:", selectedPolygon.layerId);
      }
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  // Funzione per creare un nuovo poligono editabile
  const createEditablePolygon = () => {
    if (!map || !map.editTools) return;

    // Questo creerà un poligono nel featuresLayer che è automaticamente editabile
    map.editTools.startPolygon();
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
        <h2 style={{ alignSelf: "center", margin: 0 }}>Leaflet Edit Tools</h2>

        <button
          onClick={createEditablePolygon}
          style={{
            padding: "10px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          🖊️ Disegna Poligono Editabile
        </button>
        <button
          onClick={startEditing}
          style={{
            padding: "10px",
            backgroundColor: selectedPolygon.layerId ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: selectedPolygon.layerId ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          ✏️ Modifica Poligono
        </button>
        <button
          onClick={stopEditing}
          disabled={!selectedPolygon.layerId}
          style={{
            padding: "10px",
            backgroundColor: selectedPolygon.layerId ? "#FF9800" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: selectedPolygon.layerId ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          ⏹️ Stop Editing
        </button>
        <button
          onClick={deletePolygon}
          disabled={!selectedPolygon.layerId}
          style={{
            padding: "10px",
            backgroundColor: selectedPolygon.layerId ? "#f44336" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: selectedPolygon.layerId ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          🗑️ Elimina Poligono
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
            weight: selectedPolygon.polygon === polygon ? 3 : 2,
            opacity: selectedPolygon.polygon === polygon ? 1 : 0.7,
            fillOpacity: selectedPolygon.polygon === polygon ? 0.3 : 0.2,
          }}
        />
      ))}
    </>
  );
};

export default LeafletEditTools;
