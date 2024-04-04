export const Input = ({
  type = "text",
  placeholder = "Escribe tu nombre",
  ...props
}) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      style={{
        padding: "0.8em 0.5em",
        borderRadius: "0.5em",
        maxWidth: "100%",
        minWidth: "100%",
        border: "none",
        outline: "none",
        fontSize: "1em",
      }}
      {...props}
    />
  </>
);
