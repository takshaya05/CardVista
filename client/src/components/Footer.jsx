import { Mail, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <div className="footer-title">CARDVISTA</div>
          <div className="footer-tagline">Scan. View. Connect.</div>
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} CardVista. All rights reserved.
        </div>

        <div className="footer-contact">
          <span>Contact Us</span>
          <a href="mailto:cardvista@mail.com">
            <Mail size={14} /> cardvista@mail.com
          </a>
          <a href="tel:+91XXXXXXXXXX">
            <Phone size={14} /> +91 XXXXX XXXXX
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;