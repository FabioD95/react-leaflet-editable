import L from "leaflet";
import { BUTTON_VARIANTS } from "../constants/styles";

interface DeletePolygonProps {
  removePolygon: (polygon: L.Polygon) => void;
  currentEditingPolygon: L.Polygon | null;
}

const DeletePolygon: React.FC<DeletePolygonProps> = ({
  removePolygon,
  currentEditingPolygon,
}) => {
  const deleteSelectedPolygon = () => {
    if (currentEditingPolygon) {
      // Disabilita l'editing prima di eliminare
      if (typeof currentEditingPolygon.disableEdit === "function") {
        currentEditingPolygon.disableEdit();
      }

      // Rimuovi dalla mappa
      currentEditingPolygon.remove();

      // Rimuovi dallo stato usando la nuova funzione
      removePolygon(currentEditingPolygon);

      console.log("🗑️ Poligono eliminato");
    } else {
      console.warn("⚠️ Nessun poligono selezionato da eliminare");
    }
  };

  const hasEditingPolygon = currentEditingPolygon !== null;

  return (
    <button
      onClick={deleteSelectedPolygon}
      disabled={!hasEditingPolygon}
      style={{
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: hasEditingPolygon ? "pointer" : "not-allowed",
        color: "white",
        fontSize: "14px",
        fontWeight: "normal",
        backgroundColor: hasEditingPolygon
          ? BUTTON_VARIANTS.danger
          : BUTTON_VARIANTS.disabled,
        width: "100%",
        marginTop: "10px",
      }}
    >
      🗑️ Elimina Poligono {hasEditingPolygon ? "Selezionato" : ""}
    </button>
  );
};

export default DeletePolygon;
