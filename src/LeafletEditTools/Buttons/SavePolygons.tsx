import React, { useState } from "react";
import L from "leaflet";
import { BUTTON_VARIANTS } from "../constants/styles";
import type { PolygonState, PolygonSaveData } from "../types";

interface SavePolygonsProps {
  getChangedPolygons: () => L.Polygon[];
  resetModificationFlags: () => void;
  polygonStates: Map<L.Polygon, PolygonState>;
  onSavePolygons?: (data: PolygonSaveData) => Promise<void> | void;
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
      // Separa i poligoni per tipo
      const newPolygons: L.LatLng[][] = [];
      const modifiedPolygons: { id: string; coordinates: L.LatLng[] }[] = [];
      const deletedPolygons: string[] = [];

      // Elabora i poligoni modificati e nuovi
      changedPolygons.forEach((polygon) => {
        const state = polygonStates.get(polygon);
        if (!state) return;

        const latLngs = polygon.getLatLngs();
        const coordinates = Array.isArray(latLngs[0])
          ? (latLngs[0] as L.LatLng[])
          : (latLngs as L.LatLng[]);

        if (state.isNew) {
          newPolygons.push(coordinates);
        } else if (state.isModified) {
          modifiedPolygons.push({
            id: state.id || `polygon-${polygon._leaflet_id}`,
            coordinates: coordinates,
          });
        }
      });

      // Aggiungi i poligoni eliminati (se hai un meccanismo per tracciarli)
      polygonStates.forEach((state) => {
        if (state.isDeleted && state.id) {
          deletedPolygons.push(state.id);
        }
      });

      const saveData: PolygonSaveData = {
        newPolygons,
        modifiedPolygons,
        deletedPolygons,
      };

      console.log("💾 Salvando poligoni:", {
        nuovi: newPolygons.length,
        modificati: modifiedPolygons.length,
        eliminati: deletedPolygons.length,
        data: saveData,
      });

      await onSavePolygons(saveData);

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
  const deletedCount = Array.from(polygonStates.values()).filter(
    (s) => s.isDeleted
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
              {deletedCount > 0 && ` • ${deletedCount} eliminati`}
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default SavePolygons;
