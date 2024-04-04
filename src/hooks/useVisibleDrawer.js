import { useEffect, useState } from "react";

export const useVisibleDrawer = () => {
  const [visibleDrawer, setVisibleDrawer] = useState(false);

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const hiddenDrawer = () => {
    setVisibleDrawer(false);
  };

  useEffect(() => {
    visibleDrawer
      ? (document.body.style = "overflow:hidden")
      : (document.body.style = "overflow:none");
  }, [visibleDrawer]);

  return { visibleDrawer, showDrawer, hiddenDrawer };
};
