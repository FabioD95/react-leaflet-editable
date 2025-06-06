const DisableEditor = ({
  setIsEditorVisible,
}: {
  setIsEditorVisible: (isEditorVisible: boolean) => void;
}) => {
  return (
    <button
      onClick={() => setIsEditorVisible(false)}
      style={{
        position: "absolute",
        top: "5px",
        right: "5px",
        width: "25px",
        height: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ff4d4d",
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        padding: 0,
        zIndex: 1001,
      }}
    >
      X
    </button>
  );
};
export default DisableEditor;
