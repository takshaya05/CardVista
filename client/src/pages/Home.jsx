import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <section className="home section">
      <div className="home-background-glow glow-cyan" />
      <div className="home-background-glow glow-blue" />

      <div className="home-container">
        <div className="home-content">
          <h1>CARDVISTA</h1>
          <h2>SCAN.VIEW.CONNECT</h2>

          <p className="home-description">
            Create, manage, scan, and experience digital visiting cards with
            interactive 3D and AR-style visualization.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/dashboard")}
          >
            Explore <ArrowRight size={18} />
          </button>
        </div>

        <div className="home-logo-container">
          <div className="logo-ring ring-one" />
          <div className="logo-ring ring-two" />

          <div className="home-logo-card">
            <div className="logo-card-glow" />
            <img src="/CardVista.png" alt="CardVista" className="hero-logo" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;