import { useNavigate } from "react-router-dom";
import { FaUpload, FaEye, FaQrcode, FaCube } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();

  const sections = [
    ["Upload Card", "Create and upload your digital visiting card.", "/dashboard/upload", "Upload Card", FaUpload],
    ["View Cards", "View and manage your saved digital cards.", "/dashboard/view", "View Cards", FaEye],
    ["Scan Card", "Scan a CardVista QR code using an image or camera.", "/dashboard/scan", "Scan Card", FaQrcode],
    ["AR Simulation", "Experience your card with interactive 3D visualization.", "/dashboard/ar", "Open AR", FaCube]
  ];

  return (
    <section className="dashboard section">
      <div className="section-container">
        <div className="dashboard-heading">
          <span className="section-label">CARDVISTA DASHBOARD</span>
          <h1>Manage Your Digital Cards</h1>
          <p>Upload, view, scan, and experience your digital visiting card.</p>
        </div>

        <div className="dashboard-grid">
          {sections.map(([title, description, path, action, Icon]) => (
            <div className="dashboard-card" key={title}>
              <div className="dashboard-icon">
                <Icon />
              </div>
              <h2>{title}</h2>
              <p>{description}</p>
              <button
                className="dashboard-button"
                onClick={() => navigate(path)}
              >
                {action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;