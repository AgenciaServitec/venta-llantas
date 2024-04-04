export const ButtonJsx = ({ children, type = "button", ...props }) => (
  <button
    type={type}
    style={{
      gap: "0.2em",
      padding: "0.7em 1.2em",
      textAlign: "center",
      borderRadius: "7em",
      border: "none",
      fontWeight: "700",
      cursor: "pointer",
      backgroundColor: " #fe4e02",
      color: "#fff",
      width: "100%",
      fontSize: "1.2em",
      textTransform: "upperCase",
      fontStyle: "italic",
    }}
    {...props}
  >
    {children}
  </button>
);
