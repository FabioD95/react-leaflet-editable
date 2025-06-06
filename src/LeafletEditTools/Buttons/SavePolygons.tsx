import React, { useState } from "react";
import L from "leaflet";
import { BUTTON_VARIANTS } from "../constants/styles";

interface SavePolygonsProps {
  getChangedPolygons: () => L.Polygon[];
  resetModificationFlags: () => void;
  polygonStates: Map<L.Polygon, any>;
  onSavePolygons?: (polygons: L.LatLng[][]) => Promise<void> | void;
}

const SavePolygons: React.FC<SavePolygonsProps> = ({
  getChangedPolygons,
  resetModificationFlags,
  polygonStates,
  onSavePolygons,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!onSavePolygons) return;

    const changedPolygons = getChangedPolygons();
    if (changedPolygons.length === 0) {
      console.log("ℹ️ Nessun poligono da salvare");
      return;
    }

    setIsSaving(true);

    try {
      // Estrai le coordinate solo dai poligoni modificati o nuovi
      const polygonsData: L.LatLng[][] = changedPolygons.map((polygon) => {
        const latLngs = polygon.getLatLngs();
        // Gestisci il caso di poligoni semplici o con buchi
        if (Array.isArray(latLngs[0])) {
          return latLngs[0] as L.LatLng[];
        }
        return latLngs as L.LatLng[];
      });

      // Informazioni sui poligoni da salvare
      const saveInfo = changedPolygons.map((polygon) => {
        const state = polygonStates.get(polygon);
        return {
          isNew: state?.isNew || false,
          isModified: state?.isModified || false,
        };
      });

      console.log("💾 Salvando poligoni modificati:", {
        data: polygonsData,
        info: saveInfo,
        newCount: saveInfo.filter((s) => s.isNew).length,
        modifiedCount: saveInfo.filter((s) => s.isModified).length,
      });

      await onSavePolygons(polygonsData);

      // Reset dei flag di modifica dopo il salvataggio riuscito
      resetModificationFlags();

      console.log("✅ Poligoni salvati con successo!");
    } catch (error) {
      console.error("❌ Errore durante il salvataggio:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const changedPolygons = getChangedPolygons();
  const newCount = Array.from(polygonStates.values()).filter(
    (s) => s.isNew
  ).length;
  const modifiedCount = Array.from(polygonStates.values()).filter(
    (s) => s.isModified
  ).length;
  const canSave = changedPolygons.length > 0 && onSavePolygons && !isSaving;

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
        backgroundColor: canSave
          ? BUTTON_VARIANTS.success
          : BUTTON_VARIANTS.disabled,
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
          💾 Salva Modifiche
          {changedPolygons.length > 0 && (
            <div style={{ fontSize: "11px", marginTop: "2px" }}>
              {newCount > 0 && `${newCount} nuovi`}
              {newCount > 0 && modifiedCount > 0 && " • "}
              {modifiedCount > 0 && `${modifiedCount} modificati`}
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default SavePolygons;
