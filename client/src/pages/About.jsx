import { CreditCard, Palette, ScanLine, UserRound } from "lucide-react";

function About() {
  const steps = [
    ["01", CreditCard, "Create Your Card", "Upload and manage your digital visiting card with your professional details."],
    ["02", Palette, "Customize Your Experience", "Choose AR environments, themes, effects, and music for your card."],
    ["03", ScanLine, "Scan & View", "Scan a CardVista QR code using an image or your device camera."],
    ["04", UserRound, "Connect", "Access contact details, website, maps, LinkedIn, and Instagram."]
  ];

  return (
    <section className="about section">
      <div className="section-container">
        <div className="section-heading">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Let your identity go digital</h2>
          <p>Create your digital identity, customize your card, and share your details instantly.</p>
        </div>

        <div className="instructions-grid">
          {steps.map(([number, Icon, title, description]) => (
            <div className="instruction-card" key={number}>
              <div className="instruction-top">
                <span className="instruction-number">{number}</span>
                <div className="instruction-icon"><Icon size={23} /></div>
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;