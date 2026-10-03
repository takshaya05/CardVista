import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaIdCard,
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
  FaSave,
  FaArrowLeft
} from "react-icons/fa";

function Uploadsection() {
  const navigate = useNavigate();

  const initialFormData = {
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

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const validateUrl = (value) => {
    if (!value.trim()) return true;
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    const errors = {};
    const { name, phone, email, website, linkedin, instagram, designation, company, location } = formData;

    if (!name.trim()) errors.name = "Full name is required.";
    else if (!/^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(name.trim()))
      errors.name = "Enter a valid name.";

    if (phone) {
      if (!/^[0-9+\-\s()]+$/.test(phone))
        errors.phone = "Phone number can contain only numbers and + - ( ).";
      else {
        const digits = phone.replace(/\D/g, "");
        if (digits.length < 7 || digits.length > 15)
          errors.phone = "Phone number must contain 7 to 15 digits.";
      }
    }

    if (email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email))
      errors.email = "Enter a valid email address.";

    ["website", "linkedin", "instagram"].forEach((field) => {
      if (formData[field] && !validateUrl(formData[field]))
        errors[field] = `Enter a valid ${field} URL.`;
    });

    const textFields = {
      designation: /^[A-Za-z0-9\s&.,'()/-]{1,100}$/,
      company: /^[A-Za-z0-9\s&.,'()/-]{1,100}$/,
      location: /^[A-Za-z0-9\s.,'()/#&-]{1,150}$/
    };

    Object.entries(textFields).forEach(([field, regex]) => {
      if (formData[field] && !regex.test(formData[field].trim()))
        errors[field] = `Enter a valid ${field}.`;
    });

    setFieldErrors(errors);
    return !Object.keys(errors).length;
  };

  const handleChange = ({ target: { name, value } }) => {
    const filters = {
      phone: /[^0-9+\-\s()]/g,
      name: /[^A-Za-z\s.'-]/g
    };

    const updatedValue = filters[name]
      ? value.replace(filters[name], "")
      : value;

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setMessage("");
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!validateForm()) {
      setError("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);

    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value.trim()])
      );

      const response = await fetch(`${apiUrl}/cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData)
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to save digital card.");

      setMessage("Digital card saved successfully.");
      setFormData(initialFormData);
      setFieldErrors({});

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <section className="dashboard-section section">
      <div className="section-container">
        <div className="page-top">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate("/dashboard")}
            disabled={loading}
          >
            <FaArrowLeft />
            Dashboard
          </button>
        </div>

        <div className="page-heading">
          <span className="section-label">DIGITAL CARD</span>
          <h1>Upload Your Card</h1>
          <p>
            Enter your professional information to create your CardVista
            digital visiting card.
          </p>
        </div>

        <div className="form-card">
          <div className="form-card-heading">
            <div className="form-main-icon">
              <FaIdCard />
            </div>
            <div>
              <h2>Card Information</h2>
              <p>Provide the details you want to display on your card.</p>
            </div>
          </div>

          {message && <div className="form-success">{message}</div>}
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {fields.map(([name, label, Icon, placeholder, type]) => (
                <div className="form-group" key={name}>
                  <label htmlFor={name}>
                    <Icon />
                    {label}
                  </label>

                  <input
                    id={name}
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    maxLength={name === "name" ? 50 : 250}
                    inputMode={type === "url" ? "url" : type === "tel" ? "tel" : undefined}
                    autoComplete={
                      name === "name"
                        ? "name"
                        : name === "email"
                        ? "email"
                        : name === "phone"
                        ? "tel"
                        : name === "company"
                        ? "organization"
                        : name === "designation"
                        ? "organization-title"
                        : undefined
                    }
                    required={name === "name"}
                    aria-invalid={!!fieldErrors[name]}
                  />

                  {fieldErrors[name] && (
                    <small className="field-error">{fieldErrors[name]}</small>
                  )}
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                <FaSave />
                {loading ? "Saving..." : "Save Digital Card"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Uploadsection;