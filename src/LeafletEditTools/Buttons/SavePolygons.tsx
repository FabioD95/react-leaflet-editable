import React, { useState } from "react";
import L from "leaflet";
import { BUTTON_VARIANTS } from "../constants/styles";

interface SavePolygonsProps {
  editablePolygons: L.Polygon[];
  onSavePolygons?: (polygons: L.LatLng[][]) => Promise<void> | void;
}

const SavePolygons: React.FC<SavePolygonsProps> = ({
  editablePolygons,
  onSavePolygons,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSavePolygons || editablePolygons.length === 0) return;

    setIsSaving(true);
    
    try {
      // Estrai le coordinate da tutti i poligoni
      const polygonsData: L.LatLng[][] = editablePolygons.map((polygon) => {
        const latLngs = polygon.getLatLngs();
        // Gestisci il caso di poligoni semplici o con buchi
        if (Array.isArray(latLngs[0])) {
          return latLngs[0] as L.LatLng[];
        }
        return latLngs as L.LatLng[];
      });

      console.log("💾 Salvando poligoni:", polygonsData);
      
      await onSavePolygons(polygonsData);
      
      console.log("✅ Poligoni salvati con successo!");
    } catch (error) {
      console.error("❌ Errore durante il salvataggio:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const canSave = editablePolygons.length > 0 && onSavePolygons && !isSaving;

  return (
    <button
      onClick={handleSave}
      disabled={!canSave}
      style={{
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: canSave ? "pointer" : "not-allowed",
        color: "white",
        fontSize: "14px",
        fontWeight: "normal",
        backgroundColor: canSave ? BUTTON_VARIANTS.success : BUTTON_VARIANTS.disabled,
        width: "100%",
        marginTop: "10px",
        position: "relative",
      }}
    >
      {isSaving ? (
        <>
          <span style={{ marginRight: "8px" }}>⏳</span>
          Salvando...
        </>
      ) : (
        <>
          💾 Salva Poligoni ({editablePolygons.length})
        </>
      )}
    </button>
  );
};

export default SavePolygons;