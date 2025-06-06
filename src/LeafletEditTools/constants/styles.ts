// Button variants for different states
export const BUTTON_VARIANTS = {
  primary: "#007bff",
  danger: "#dc3545",
  warning: "#ff9800",
  success: "#4CAF50",
  secondary: "#6c757d",
  disabled: "#ccc",
};

export const EDITOR_PANEL_STYLES = {
  position: "absolute" as const,
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
  flexDirection: "column" as const,
  alignItems: "flex-start" as const,
  padding: "10px",
  gap: "10px",
};

// Base button styles
const BASE_BUTTON_STYLES = {
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  color: "white",
  fontSize: "14px",
  fontWeight: "normal" as const,
};

// Enable Editor Button
export const ENABLE_EDITOR_BUTTON_STYLES = {
  ...BASE_BUTTON_STYLES,
  position: "absolute" as const,
  top: 10,
  right: 10,
  zIndex: 1000,
  backgroundColor: "#007bff",
};

// Disable Editor Button (X button)
export const DISABLE_EDITOR_BUTTON_STYLES = {
  position: "absolute" as const,
  top: "5px",
  right: "5px",
  width: "25px",
  height: "25px",
  display: "flex",
  justifyContent: "center" as const,
  alignItems: "center" as const,
  backgroundColor: "#ff4d4d",
  color: "white",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold" as const,
  padding: 0,
  zIndex: 1001,
};

// Create Editable Polygon Button
export const CREATE_POLYGON_BUTTON_STYLES = {
  ...BASE_BUTTON_STYLES,
  backgroundColor: "#007bff",
  width: "100%",
};

// Delete Polygon Button
export const DELETE_POLYGON_BUTTON_STYLES = {
  ...BASE_BUTTON_STYLES,
  backgroundColor: BUTTON_VARIANTS.danger,
  width: "100%",
  marginTop: "10px",
};

// Disable All Editing Button
export const DISABLE_ALL_EDITING_BUTTON_STYLES = {
  ...BASE_BUTTON_STYLES,
  backgroundColor: "#dc3545",
  width: "100%",
  marginTop: "10px",
};

// Save Polygons Button
export const SAVE_POLYGONS_BUTTON_STYLES = {
  ...BASE_BUTTON_STYLES,
  backgroundColor: BUTTON_VARIANTS.success,
  width: "100%",
  marginTop: "10px",
};

// Button styles with state variants
export const getButtonStyles = (
  baseStyle: typeof BASE_BUTTON_STYLES,
  variant: keyof typeof BUTTON_VARIANTS,
  disabled: boolean = false
) => ({
  ...baseStyle,
  backgroundColor: disabled
    ? BUTTON_VARIANTS.disabled
    : BUTTON_VARIANTS[variant],
  cursor: disabled ? "not-allowed" : "pointer",
});
