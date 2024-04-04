import { useVisibleDrawer } from "../hooks/index.js";

const MenuButton = ({ children }) => {
  const { visibleDrawer, showDrawer, hiddenDrawer } = useVisibleDrawer();

  return (
    <>
      <button
        style={{ border: "none", background: "none" }}
        onClick={showDrawer}
      >
        {children}
      </button>

      <section
        style={{
          position: "fixed",
          zIndex: "100",
          width: "100vw",
          height: "100vh",
          top: "0",
          right: "0",
          background: "rgba(0,0,0,0.8)",
          transition: "all 0.3s ease-in-out ",
          transform: visibleDrawer ? " translateX(0%)" : " translateX(100%)",
          display: "grid",
          gridTemplateColumns: "25% 1fr",
        }}
      >
        <div onClick={hiddenDrawer}></div>
        <article style={{ background: "#13151a", padding: "2em 1em" }}>
          <ul style={{ listStyle: "none" }}>
            <ItemLi text="Inicio" onHiddenDrawer={hiddenDrawer} />
            <ItemLi
              text="Nosotros"
              path="/about-us"
              onHiddenDrawer={hiddenDrawer}
            />
            <ItemLi
              text="Productos"
              path="/products"
              onHiddenDrawer={hiddenDrawer}
            />
            <ItemLi
              text="Contacto"
              path="/contact"
              onHiddenDrawer={hiddenDrawer}
            />
          </ul>
        </article>
      </section>
    </>
  );
};

export default MenuButton;

const ItemLi = ({ text, path = "/", onHiddenDrawer }) => (
  <li
    style={{ padding: "0.3em 0", fontSize: "1.5em" }}
    onClick={onHiddenDrawer}
  >
    <a
      href={path}
      style={{
        textDecoration: "none",
      }}
      className="color__primary"
    >
      {text}
    </a>
  </li>
);
