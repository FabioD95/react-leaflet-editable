import React from "react";
import L from "leaflet";
import { BUTTON_VARIANTS } from "../constants/styles";
import type { PolygonState } from "../types";

interface RestorePolygonProps {
  restorePolygonOriginalCoordinates: (polygon: L.Polygon) => boolean;
  currentEditingPolygon: L.Polygon | null;
  polygonStates: Map<L.Polygon, PolygonState>;
}

const RestorePolygon: React.FC<RestorePolygonProps> = ({
  restorePolygonOriginalCoordinates,
  currentEditingPolygon,
  polygonStates,
}) => {
  const handleRestore = () => {
    if (currentEditingPolygon) {
      console.log("🔄 Tentativo di ripristino per:", currentEditingPolygon);
      const currentState = polygonStates.get(currentEditingPolygon);
      console.log("📊 Stato corrente:", currentState);

      const success = restorePolygonOriginalCoordinates(currentEditingPolygon);
      if (success) {
        console.log("✅ Poligono ripristinato alla versione originale");
      } else {
        console.warn("⚠️ Impossibile ripristinare il poligono");
      }
    }
  };

  // Verifica se il poligono selezionato può essere ripristinato
  const currentState = currentEditingPolygon
    ? polygonStates.get(currentEditingPolygon)
    : null;

  const canRestore =
    currentEditingPolygon &&
    currentState &&
    !currentState.isNew &&
    currentState.isModified &&
    currentState.originalCoordinates &&
    currentState.originalCoordinates.length > 0;

  // Debug info
  if (currentEditingPolygon && currentState) {
    console.log("🔍 Debug RestorePolygon:", {
      hasPolygon: !!currentEditingPolygon,
      hasState: !!currentState,
      isNew: currentState.isNew,
      isModified: currentState.isModified,
      hasOriginalCoords: !!currentState.originalCoordinates,
      originalCoordsLength: currentState.originalCoordinates?.length || 0,
      canRestore,
    });
  }

  return (
    <button
      onClick={handleRestore}
      disabled={!canRestore}
      style={{
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: canRestore ? "pointer" : "not-allowed",
        color: "white",
        fontSize: "14px",
        fontWeight: "normal",
        backgroundColor: canRestore
          ? BUTTON_VARIANTS.warning
          : BUTTON_VARIANTS.disabled,
        width: "100%",
        marginTop: "10px",
      }}
    >
      🔄 Ripristina Originale
      {canRestore && (
        <div style={{ fontSize: "11px", marginTop: "2px" }}>
          Annulla le modifiche
        </div>
      )}
    </button>
  );
};

export default RestorePolygon;
