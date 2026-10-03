import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <button className="brand" onClick={() => goTo("/")}>
          <img src="/CardVista.png" alt="CardVista" />
          <div className="brand-text">
            <span className="brand-title">CARDVISTA</span>
            <span className="brand-tagline">Scan.View.Connect</span>
          </div>
        </button>

        <nav className="desktop-nav">
          {links.map(({ name, path }) => (
            <button
              key={path}
              className={pathname === path ? "active" : ""}
              onClick={() => goTo(path)}
            >
              {name}
            </button>
          ))}
        </nav>

        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="mobile-nav">
          {links.map(({ name, path }) => (
            <button
              key={path}
              className={pathname === path ? "active" : ""}
              onClick={() => goTo(path)}
            >
              {name}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;