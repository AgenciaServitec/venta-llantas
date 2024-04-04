export const Textarea = ({ placeholder = "Escribe mensaje", ...props }) => {
  return (
    <textarea
      placeholder={placeholder}
      style={{
        padding: "0.8em 0.5em",
        maxWidth: "100%",
        minWidth: "100%",
        borderRadius: "0.5em",
        border: "none",
        outline: "none",
        fontSize: "1em",
        minHeight: "5em",
      }}
      {...props}
    ></textarea>
  );
};
