import React, { useState } from "react";
import L from "leaflet";
import { BUTTON_VARIANTS } from "../constants/styles";
import type { PolygonState } from "../types";

interface ResetToOriginalProps {
  resetToOriginalState: () => boolean;
  polygonStates: Map<L.Polygon, PolygonState>;
}

const ResetToOriginal: React.FC<ResetToOriginalProps> = ({
  resetToOriginalState,
  polygonStates,
}) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    const confirmReset = window.confirm(
      "⚠️ Sei sicuro di voler ripristinare tutto allo stato originale?\n\n" +
      "Questa azione:\n" +
      "• Rimuoverà tutti i nuovi poligoni\n" +
      "• Ripristinerà i poligoni eliminati\n" +
      "• Annullerà tutte le modifiche\n\n" +
      "Questa operazione non può essere annullata."
    );

    if (!confirmReset) {
      return;
    }

    setIsResetting(true);

    try {
      const success = resetToOriginalState();
      if (success) {
        console.log("✅ Reset completo eseguito con successo!");
      } else {
        console.warn("⚠️ Si sono verificati problemi durante il reset");
      }
    } catch (error) {
      console.error("❌ Errore durante il reset:", error);
    } finally {
      setIsResetting(false);
    }
  };

  // Calcola se ci sono modifiche da resettare
  const hasChanges = Array.from(polygonStates.values()).some(
    (state) => state.isNew || state.isModified || state.isDeleted
  );

  const newCount = Array.from(polygonStates.values()).filter(
    (s) => s.isNew
  ).length;
  const modifiedCount = Array.from(polygonStates.values()).filter(
    (s) => s.isModified && !s.isDeleted
  ).length;
  const deletedCount = Array.from(polygonStates.values()).filter(
    (s) => s.isDeleted
  ).length;

  return (
    <button
      onClick={handleReset}
      disabled={!hasChanges || isResetting}
      style={{
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: hasChanges && !isResetting ? "pointer" : "not-allowed",
        color: "white",
        fontSize: "14px",
        fontWeight: "normal",
        backgroundColor: hasChanges && !isResetting
          ? BUTTON_VARIANTS.danger
          : BUTTON_VARIANTS.disabled,
        width: "100%",
        marginTop: "10px",
      }}
    >
      {isResetting ? (
        <>
          <span style={{ marginRight: "8px" }}>⏳</span>
          Resettando...
        </>
      ) : (
        <>
          🔄 Reset Completo
          {hasChanges && (
            <div style={{ fontSize: "11px", marginTop: "2px" }}>
              {newCount > 0 && `${newCount} nuovi`}
              {newCount > 0 && (modifiedCount > 0 || deletedCount > 0) && " • "}
              {modifiedCount > 0 && `${modifiedCount} modificati`}
              {(newCount > 0 || modifiedCount > 0) && deletedCount > 0 && " • "}
              {deletedCount > 0 && `${deletedCount} eliminati`}
            </div>
          )}
        </>
      )}
    </button>
  );
};

export default ResetToOriginal;