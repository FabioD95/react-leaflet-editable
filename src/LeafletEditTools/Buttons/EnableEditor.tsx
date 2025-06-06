const EnableEditor = ({
  isEditorVisible,
  setIsEditorVisible,
}: {
  isEditorVisible: boolean;
  setIsEditorVisible: (isEditorVisible: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setIsEditorVisible(true)}
      style={{
        visibility: !isEditorVisible ? "visible" : "hidden",
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Attiva Editor
    </button>
  );
};
export default EnableEditor;
