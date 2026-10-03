import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
  FaEye,
  FaEdit,
  FaTrash,
  FaIdCard,
  FaTimes,
  FaSave,
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaQrcode,
  FaDownload
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";

function Viewsection() {
  const navigate = useNavigate();
  const qrCanvasRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const emptyForm = {
    name: "",
    designation: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    linkedin: "",
    instagram: ""
  };

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewCard, setViewCard] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [qrCard, setQrCard] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [qrDownloading, setQrDownloading] = useState(false);

  const getId = (card) => card?._id || card?.id;

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const message = (type, text) => {
    type === "error" ? setError(text) : setSuccess(text);
    setTimeout(() => type === "error" ? setError("") : setSuccess(""), 2500);
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${apiUrl}/cards`);
      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.message || "Failed to load cards.");

      setCards(Array.isArray(data) ? data : data?.cards || []);
    } catch (err) {
      setError(err.message || "Unable to load digital cards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const isBusy = (id) => activeAction?.id === id;
  const isAction = (id, action) =>
    activeAction?.id === id && activeAction?.action === action;

  const handleView = (card) => {
    if (isBusy(getId(card))) return;
    clearMessages();
    setViewCard(card);
  };

  const handleEdit = (card) => {
    if (isBusy(getId(card))) return;
    clearMessages();
    setEditErrors({});
    setEditCard({ ...emptyForm, ...card });
  };

  const handleQr = (card) => {
    if (isBusy(getId(card))) return;
    clearMessages();
    setQrCard(card);
  };

  const handleDelete = async (id) => {
    if (isBusy(id) || !window.confirm("Are you sure you want to delete this digital card?")) return;

    try {
      setActiveAction({ id, action: "delete" });
      clearMessages();

      const res = await fetch(`${apiUrl}/cards/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.message || "Failed to delete card.");

      setCards((prev) => prev.filter((card) => getId(card) !== id));
      if (getId(viewCard) === id) setViewCard(null);
      if (getId(editCard) === id) setEditCard(null);
      if (getId(qrCard) === id) setQrCard(null);

      message("success", "Digital card deleted successfully.");
    } catch (err) {
      setError(err.message || "Unable to delete digital card.");
    } finally {
      setActiveAction(null);
    }
  };

  const handleEditChange = ({ target: { name, value } }) => {
    if (name === "phone") value = value.replace(/[^0-9+\-\s()]/g, "");
    if (name === "name") value = value.replace(/[^A-Za-z\s.'-]/g, "");

    setEditCard((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: "" }));
    clearMessages();
  };

  const validUrl = (value) => {
    if (!value?.trim()) return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!editCard) return false;

    const errors = {};
    const name = editCard.name?.trim() || "";
    const phone = editCard.phone?.trim() || "";
    const email = editCard.email?.trim() || "";

    if (!name) errors.name = "Full name is required.";
    else if (!/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(name))
      errors.name = "Enter a valid name.";

    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (!/^[0-9+\-\s()]+$/.test(phone))
        errors.phone = "Invalid phone number.";
      else if (digits.length < 7 || digits.length > 15)
        errors.phone = "Phone number must contain 7 to 15 digits.";
    }

    if (
      email &&
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    )
      errors.email = "Enter a valid email address.";

    ["website", "linkedin", "instagram"].forEach((field) => {
      if (!validUrl(editCard[field]))
        errors[field] = "Enter a valid URL.";
    });

    const rules = {
      designation: /^[A-Za-z0-9\s&.,'()/-]{1,100}$/,
      company: /^[A-Za-z0-9\s&.,'()/-]{1,100}$/,
      location: /^[A-Za-z0-9\s.,'()/#&-]{1,150}$/
    };

    Object.entries(rules).forEach(([field, regex]) => {
      const value = editCard[field]?.trim();
      if (value && !regex.test(value))
        errors[field] = `Enter a valid ${field}.`;
    });

    setEditErrors(errors);
    return !Object.keys(errors).length;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editCard || !validateForm()) {
      setError("Please correct the highlighted fields.");
      return;
    }

    const id = getId(editCard);
    if (!id || isBusy(id)) return;

    try {
      setActiveAction({ id, action: "edit" });
      clearMessages();

      const dataToSend = Object.fromEntries(
        Object.keys(emptyForm).map((key) => [
          key,
          (editCard[key] || "").trim()
        ])
      );

      const res = await fetch(`${apiUrl}/cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok)
        throw new Error(data?.message || "Failed to update card.");

      setCards((prev) =>
        prev.map((card) => getId(card) === id ? data.card : card)
      );

      setEditCard(null);
      setEditErrors({});
      message("success", "Digital card updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update digital card.");
    } finally {
      setActiveAction(null);
    }
  };

  const externalUrl = (url) =>
    !url ? "#" : /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const mapsUrl = (location) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  const cleanUrl = (url) =>
    url?.replace(/^https?:\/\//i, "").replace(/\/$/, "") || "Not provided";

  const qrValue = (card) => `cardvista:${getId(card)}`;

  const downloadQr = () => {
    if (!qrCard || qrDownloading) return;

    try {
      setQrDownloading(true);

      const canvas = qrCanvasRef.current;
      if (!canvas) throw new Error("QR code is not ready yet.");

      const name = (qrCard.name || "CardVista-Card")
        .trim()
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "") || "CardVista-Card";

      const link = document.createElement("a");
      link.download = `${name}-QR.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      message("success", "QR code downloaded successfully.");
    } catch (err) {
      setError(err.message || "Unable to download QR code.");
    } finally {
      setQrDownloading(false);
    }
  };

  const renderDigitalCard = (card) => (
    <div className="digital-card">
      <div className="digital-card-glow" />

      <div className="digital-card-header">
        <div className="digital-card-brand">
          <img src="/CardVista.png" alt="CardVista" />
          <span>CARDVISTA</span>
        </div>
        <FaIdCard className="digital-card-mark" />
      </div>

      <div className="digital-card-body">
        <h2>{card.name || "Your Name"}</h2>
        <h3>{card.designation || "Your Designation"}</h3>
        <p>{card.company || "Your Company"}</p>

        <div className="digital-card-contact">
          {[
            [card.phone, FaPhone, `tel:${card.phone}`, card.phone],
            [card.email, FaEnvelope, `mailto:${card.email}`, card.email],
            [card.website, FaGlobe, externalUrl(card.website), cleanUrl(card.website)],
            [card.location, FaMapMarkerAlt, mapsUrl(card.location), card.location]
          ].map(([value, Icon, href, text], i) =>
            value && (
              <a
                key={i}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="card-contact-link"
              >
                <Icon />
                <span>{text}</span>
              </a>
            )
          )}
        </div>
      </div>

      <div className="digital-card-social">
        {[
          [card.linkedin, FaLinkedin],
          [card.instagram, FaInstagram]
        ].map(([url, Icon], i) =>
          url && (
            <a
              key={i}
              href={externalUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              className="card-social-link"
            >
              <Icon />
              <span>{cleanUrl(url)}</span>
            </a>
          )
        )}
      </div>
    </div>
  );

  const fields = [
    ["name", "Full Name", FaUser, "Enter your full name", "text"],
    ["designation", "Designation", FaBriefcase, "Enter your designation", "text"],
    ["company", "Company", FaBuilding, "Enter company name", "text"],
    ["phone", "Phone", FaPhone, "Enter phone number", "tel"],
    ["email", "Email", FaEnvelope, "Enter email address", "email"],
    ["website", "Website", FaGlobe, "https://example.com", "url"],
    ["location", "Location", FaMapMarkerAlt, "Enter location", "text"],
    ["linkedin", "LinkedIn", FaLinkedin, "https://linkedin.com/in/username", "url"],
    ["instagram", "Instagram", FaInstagram, "https://instagram.com/username", "url"]
  ];

  if (loading)
    return (
      <section className="dashboard-section section">
        <div className="section-container">
          <div className="page-top">
            <button
              className="back-button"
              onClick={() => navigate("/dashboard")}
            >
              <FaArrowLeft /> Dashboard
            </button>
          </div>
          <div className="page-heading">
            <span className="section-label">DIGITAL CARDS</span>
            <h1>View Your Cards</h1>
            <p>View, edit, and manage your digital visiting cards.</p>
          </div>
          <div className="cards-loading">Loading your digital cards...</div>
        </div>
      </section>
    );

  return (
    <section className="dashboard-section section">
      <div className="section-container">
        <div className="page-top">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
            disabled={!!activeAction}
          >
            <FaArrowLeft /> Dashboard
          </button>
        </div>

        <div className="page-heading">
          <span className="section-label">DIGITAL CARDS</span>
          <h1>View Your Cards</h1>
          <p>View, edit, generate QR codes, and manage your digital visiting cards.</p>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        {!cards.length ? (
          <div className="empty-cards">
            <div className="empty-cards-icon"><FaIdCard /></div>
            <h2>No Digital Cards Found</h2>
            <p>You have not created a digital visiting card yet.</p>
            <button
              className="primary-button"
              onClick={() => navigate("/dashboard/upload")}
            >
              Create Digital Card
            </button>
          </div>
        ) : (
          <div className="cards-list">
            {cards.map((card) => {
              const id = getId(card);
              const busy = isBusy(id);

              return (
                <div className="digital-card-wrapper" key={id}>
                  {renderDigitalCard(card)}

                  <div className="card-actions">
                    <button
                      className="card-action-button"
                      onClick={() => handleView(card)}
                      disabled={busy}
                    >
                      <FaEye /> {isAction(id, "view") ? "Opening..." : "View"}
                    </button>

                    <button
                      className="card-action-button"
                      onClick={() => handleEdit(card)}
                      disabled={busy}
                    >
                      <FaEdit /> {isAction(id, "edit") ? "Editing..." : "Edit"}
                    </button>

                    <button
                      className="card-action-button"
                      onClick={() => handleQr(card)}
                      disabled={busy}
                    >
                      <FaQrcode /> QR
                    </button>

                    <button
                      className="card-action-button delete-action"
                      onClick={() => handleDelete(id)}
                      disabled={busy}
                    >
                      <FaTrash /> {isAction(id, "delete") ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {viewCard && (
        <div className="card-modal-overlay" onClick={() => setViewCard(null)}>
          <div className="card-modal" onClick={(e) => e.stopPropagation()}>
            <ModalHeader title="Card Details" onClose={() => setViewCard(null)} />

            <div className="modal-card-preview">
              {renderDigitalCard(viewCard)}
            </div>

            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setViewCard(null)}>
                Close
              </button>

              <button
                className="primary-button"
                onClick={() => {
                  const card = viewCard;
                  setViewCard(null);
                  handleEdit(card);
                }}
              >
                <FaEdit /> Edit Card
              </button>

              <button
                className="primary-button"
                onClick={() => {
                  const card = viewCard;
                  setViewCard(null);
                  handleQr(card);
                }}
              >
                <FaQrcode /> QR Code
              </button>
            </div>
          </div>
        </div>
      )}

      {editCard && (
        <div className="card-modal-overlay" onClick={() => !isAction(getId(editCard), "edit") && setEditCard(null)}>
          <div className="card-modal edit-modal" onClick={(e) => e.stopPropagation()}>
            <ModalHeader
              title="Edit Card"
              onClose={() => !isAction(getId(editCard), "edit") && setEditCard(null)}
            />

            <form onSubmit={handleUpdate}>
              <div className="edit-form-grid">
                {fields.map(([name, label, Icon, placeholder, type]) => (
                  <div className="form-group" key={name}>
                    <label htmlFor={`edit-${name}`}>
                      <Icon /> {label}
                    </label>

                    <input
                      id={`edit-${name}`}
                      type={type}
                      name={name}
                      value={editCard[name] || ""}
                      onChange={handleEditChange}
                      placeholder={placeholder}
                      maxLength={name === "name" ? 50 : name === "location" ? 150 : 250}
                      inputMode={type === "url" ? "url" : type === "tel" ? "tel" : undefined}
                      required={name === "name"}
                      aria-invalid={!!editErrors[name]}
                    />

                    {editErrors[name] && (
                      <small className="field-error">{editErrors[name]}</small>
                    )}
                  </div>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditCard(null)}
                  disabled={isAction(getId(editCard), "edit")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={isAction(getId(editCard), "edit")}
                >
                  <FaSave />
                  {isAction(getId(editCard), "edit") ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {qrCard && (
        <div className="card-modal-overlay" onClick={() => !qrDownloading && setQrCard(null)}>
          <div className="card-modal qr-modal" onClick={(e) => e.stopPropagation()}>
            <ModalHeader
              title="Generate QR Code"
              label="CARDVISTA QR"
              onClose={() => !qrDownloading && setQrCard(null)}
            />

            <div className="qr-modal-content">
              <div className="qr-card-info">
                <FaIdCard />
                <div>
                  <h3>{qrCard.name || "Digital Card"}</h3>
                  <p>{qrCard.designation || "CardVista Digital Visiting Card"}</p>
                  {qrCard.company && <span>{qrCard.company}</span>}
                </div>
              </div>

              <div className="qr-code-container">
                <QRCodeCanvas
                  ref={qrCanvasRef}
                  value={qrValue(qrCard)}
                  size={280}
                  bgColor="#ffffff"
                  fgColor="#071018"
                  level="H"
                  includeMargin
                />
              </div>

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  onClick={() => setQrCard(null)}
                  disabled={qrDownloading}
                >
                  Close
                </button>

                <button
                  className="primary-button"
                  onClick={downloadQr}
                  disabled={qrDownloading}
                >
                  <FaDownload />
                  {qrDownloading ? "Downloading..." : "Download QR"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ModalHeader({ title, label = "DIGITAL CARD", onClose }) {
  return (
    <div className="card-modal-header">
      <div>
        <span className="section-label">{label}</span>
        <h2>{title}</h2>
      </div>

      <button className="modal-close-button" onClick={onClose}>
        <FaTimes />
      </button>
    </div>
  );
}

export default Viewsection;