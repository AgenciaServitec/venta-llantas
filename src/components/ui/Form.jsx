import React from "react";
// interface Props {
//     onSubmit?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
//     children?: React.ReactNode;
// }

export const Form = ({ children, ...props }) => (
  <form noValidate autoComplete="off" {...props}>
    <div
      className="form-content"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  </form>
);
