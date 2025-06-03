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

  // Stato per tracciare i poligoni creati dinamicamente
  const [createdPolygons, setCreatedPolygons] = useState<LatLngExpression[][]>(
    []
  );

  // Stato per tracciare se stiamo disegnando
  const [isDrawing, setIsDrawing] = useState(false);

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
      const onDrawingStart = (e: LeafletEvent) => {
        console.log("🎨 Inizio disegno", e);
        setIsDrawing(true);
      };

      const onDrawingEnd = (e: LeafletEvent) => {
        console.log("✅ Disegno completato", e);
        setIsDrawing(false);

        const layer = e.layer;

        // Estrai le coordinate e aggiungile allo stato
        if (layer && layer instanceof L.Polygon) {
          const latlngs = layer.getLatLngs()[0] as L.LatLng[];
          const coordinates: LatLngExpression[] = latlngs.map((latlng) => [
            latlng.lat,
            latlng.lng,
          ]);

          setCreatedPolygons((prev) => [...prev, coordinates]);

          // Disabilita automaticamente l'editing dopo la creazione
          setTimeout(() => {
            if (layer && typeof layer.disableEdit === "function") {
              layer.disableEdit();
            }
          }, 100);
        }
      };

      const onDrawingCancel = (e: LeafletEvent) => {
        console.log("❌ Disegno cancellato", e);
        setIsDrawing(false);
      };

      map.on("editable:drawing:start", onDrawingStart);
      map.on("editable:drawing:end", onDrawingEnd);
      map.on("editable:drawing:cancel", onDrawingCancel);

      return () => {
        map.off("editable:drawing:start", onDrawingStart);
        map.off("editable:drawing:end", onDrawingEnd);
        map.off("editable:drawing:cancel", onDrawingCancel);
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

    try {
      const layer = polygonLayerGroup.current.getLayer(selectedPolygon.layerId);
      if (layer && layer instanceof L.Polygon) {
        const editableLayer = layer as L.Polygon & EditableMixin;
        if (typeof editableLayer.enableEdit === "function") {
          editableLayer.enableEdit();
          console.log(
            "✏️ Editing abilitato per layer:",
            selectedPolygon.layerId
          );
        }
      }
    } catch (error) {
      console.error("Errore durante l'abilitazione dell'editing:", error);
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

        // Rimuovi anche dallo stato dei poligoni creati
        if (selectedPolygon.polygon) {
          setCreatedPolygons((prev) =>
            prev.filter((poly) => poly !== selectedPolygon.polygon)
          );
        }

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

  // Funzione per cancellare il disegno corrente
  const cancelDrawing = () => {
    if (!map || !map.editTools) return;

    map.editTools.stopDrawing();
    setIsDrawing(false);
  };

  // Combina i poligoni iniziali con quelli creati dinamicamente
  const allPolygons = [...polygons, ...createdPolygons];

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

        {/* Stato corrente */}
        <div style={{ fontSize: "12px", color: "#666", width: "100%" }}>
          {isDrawing && <p>🎨 Disegnando... (click per terminare)</p>}
          {selectedPolygon.layerId && (
            <p>✅ Selezionato: Layer {selectedPolygon.layerId}</p>
          )}
        </div>

        <button
          onClick={createEditablePolygon}
          disabled={isDrawing}
          style={{
            padding: "10px",
            backgroundColor: isDrawing ? "#ccc" : "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isDrawing ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          🖊️ Disegna Poligono Editabile
        </button>

        {isDrawing && (
          <button
            onClick={cancelDrawing}
            style={{
              padding: "10px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            ❌ Annulla Disegno
          </button>
        )}

        <button
          onClick={startEditing}
          disabled={!selectedPolygon.layerId || isDrawing}
          style={{
            padding: "10px",
            backgroundColor:
              selectedPolygon.layerId && !isDrawing ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor:
              selectedPolygon.layerId && !isDrawing ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          ✏️ Modifica Poligono
        </button>

        <button
          onClick={stopEditing}
          disabled={!selectedPolygon.layerId || isDrawing}
          style={{
            padding: "10px",
            backgroundColor:
              selectedPolygon.layerId && !isDrawing ? "#FF9800" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor:
              selectedPolygon.layerId && !isDrawing ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          ⏹️ Stop Editing
        </button>

        <button
          onClick={deletePolygon}
          disabled={!selectedPolygon.layerId || isDrawing}
          style={{
            padding: "10px",
            backgroundColor:
              selectedPolygon.layerId && !isDrawing ? "#f44336" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor:
              selectedPolygon.layerId && !isDrawing ? "pointer" : "not-allowed",
            width: "100%",
          }}
        >
          🗑️ Elimina Poligono
        </button>

        {/* Info sui poligoni */}
        <div style={{ fontSize: "12px", color: "#666", width: "100%" }}>
          <p>Poligoni totali: {allPolygons.length}</p>
          <p>Poligoni creati: {createdPolygons.length}</p>
        </div>
      </div>

      {allPolygons.map((polygon, index) => (
        <Polygon
          key={`polygon-${index}`}
          positions={polygon}
          eventHandlers={{
            add: (leafletEvent: LeafletEvent) => {
              addLayerToGroup(leafletEvent.target);
            },
            click: (leafletEvent: LeafletEvent) => {
              if (!isDrawing) {
                setSelectedPolygon({
                  polygon: polygon,
                  layerId: leafletEvent.target._leaflet_id,
                });
              }
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
