import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaQrcode,
  FaCamera,
  FaUpload,
  FaImage,
  FaTimes
} from "react-icons/fa";
import { Html5Qrcode } from "html5-qrcode";

function Scansection() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const imageScannerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "https://cardvista-backend.onrender.com";

  const fetchCard = async (cardId) => {
    if (!cardId) throw new Error("Invalid CardVista card ID.");

    const response = await fetch(`${apiUrl}/api/cards/${cardId}`);
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.card) {
      throw new Error(data?.message || "Card not found in the database.");
    }

    return data.card;
  };

  const stopCamera = async () => {
    const scanner = scannerRef.current;

    if (scanner) {
      try {
        await scanner.stop();
      } catch {}

      try {
        scanner.clear();
      } catch {}
    }

    scannerRef.current = null;
    setCameraActive(false);
    setScanning(false);
  };

  const handleScanResult = async (decodedText) => {
    if (!decodedText) return;

    await stopCamera();
    setError("");
    setSuccess("");
    setScanning(true);

    try {
      const text = decodedText.trim();
      let cardId = "";

      if (text.startsWith("cardvista:")) {
        cardId = text.replace("cardvista:", "").trim();
      } else if (/^https?:\/\//.test(text)) {
        const url = new URL(text);
        const path = url.pathname.replace(/\/+$/, "");
        const match = path.match(/^\/(?:dashboard\/view|card)\/([^/]+)$/);

        if (match) {
          cardId = match[1];
        } else {
          window.location.href = text;
          return;
        }
      } else {
        throw new Error("This QR code is not a valid CardVista QR code.");
      }

      if (!cardId) {
        throw new Error("The QR code does not contain a valid card ID.");
      }

      const card = await fetchCard(cardId);

      if (!card?._id) {
        throw new Error("Card was not found in the database.");
      }

      setSuccess("Card found. Opening digital card...");
      navigate(`/dashboard/view/${card._id}`);
    } catch (err) {
      console.error("QR processing error:", err);
      setError(err.message || "Unable to find this CardVista card.");
    } finally {
      setScanning(false);
    }
  };

  const startCamera = async () => {
    setError("");
    setSuccess("");
    setSelectedFile(null);

    try {
      await stopCamera();

      const scanner = new Html5Qrcode("cardvista-camera-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1
        },
        async (text) => {
          if (scannerRef.current) await handleScanResult(text);
        },
        () => {}
      );

      setCameraActive(true);
      setScanning(true);
    } catch (err) {
      console.error("Camera start error:", err);

      scannerRef.current = null;
      setCameraActive(false);
      setScanning(false);

      const message = err?.message?.toLowerCase() || "";

      setError(
        message.includes("permission") ||
          message.includes("notallowed") ||
          message.includes("denied")
          ? "Camera permission was denied. Please allow camera access and try again."
          : message.includes("camera") || message.includes("device")
          ? "Unable to access the camera. Please check your camera and browser permissions."
          : "Unable to start the camera. Please try again."
      );
    }
  };

  const handleFileChange = ({ target }) => {
    const file = target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid PNG, JPG, or JPEG image.");
      setSelectedFile(null);
      target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      setSelectedFile(null);
      target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const scanUploadedImage = async () => {
    if (!selectedFile) {
      setError("Please select a QR image first.");
      return;
    }

    setError("");
    setSuccess("");
    setScanning(true);

    try {
      imageScannerRef.current?.clear();

      const scanner = new Html5Qrcode("cardvista-image-reader");
      imageScannerRef.current = scanner;

      const result = await scanner.scanFile(selectedFile, false);
      scanner.clear();
      imageScannerRef.current = null;

      await handleScanResult(result);
    } catch (err) {
      console.error("Image scan error:", err);

      try {
        imageScannerRef.current?.clear();
      } catch {}

      imageScannerRef.current = null;
      setScanning(false);
      setError("No valid CardVista QR code was found in the selected image.");
      setSuccess("");
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;

      if (scanner) {
        scanner.stop().catch(() => {}).finally(() => {
          try {
            scanner.clear();
          } catch {}
          scannerRef.current = null;
        });
      }

      try {
        imageScannerRef.current?.clear();
      } catch {}

      imageScannerRef.current = null;
    };
  }, []);

  return (
    <section className="dashboard-section section">
      <div className="section-container">
        <div className="page-top">
          <button
            type="button"
            className="back-button"
            onClick={async () => {
              await stopCamera();
              navigate("/dashboard");
            }}
            disabled={scanning && !cameraActive}
          >
            <FaArrowLeft />
            Dashboard
          </button>
        </div>

        <div className="page-heading">
          <span className="section-label">QR SCANNER</span>
          <h1>Scan a CardVista Card</h1>
          <p>
            Scan a digital visiting card using your camera or upload a QR
            code image.
          </p>
        </div>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <div className="scanner-grid">
          <div className="scanner-card">
            <div className="scanner-icon">
              <FaCamera />
            </div>

            <h2>Scan with Camera</h2>
            <p>
              Use your device camera to scan a CardVista QR code and open
              the associated digital visiting card.
            </p>

            {!cameraActive && (
              <div className="camera-placeholder">
                <FaQrcode />
                <span>Camera Scanner</span>
              </div>
            )}

            <div
              id="cardvista-camera-reader"
              className={cameraActive ? "camera-reader active" : "camera-reader"}
            />

            {!cameraActive ? (
              <button
                type="button"
                className="primary-button"
                onClick={startCamera}
                disabled={scanning}
              >
                <FaCamera />
                Start Camera
              </button>
            ) : (
              <button
                type="button"
                className="secondary-button"
                onClick={stopCamera}
              >
                <FaTimes />
                Stop Camera
              </button>
            )}

            {scanning && cameraActive && (
              <p className="scanner-status">
                Point your camera at a CardVista QR code.
              </p>
            )}
          </div>

          <div className="scanner-card">
            <div className="scanner-icon">
              <FaUpload />
            </div>

            <h2>Upload QR Image</h2>
            <p>
              Select a QR code image from your device to identify the
              associated CardVista digital card.
            </p>

            <label className="qr-upload-area">
              <FaImage />
              <span>{selectedFile?.name || "Select QR Image"}</span>
              <small>PNG, JPG or JPEG</small>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                disabled={scanning}
              />
            </label>

            {selectedFile && (
              <button
                type="button"
                className="secondary-button"
                onClick={clearSelectedFile}
                disabled={scanning}
              >
                <FaTimes />
                Remove Image
              </button>
            )}

            <button
              type="button"
              className="primary-button"
              onClick={scanUploadedImage}
              disabled={!selectedFile || scanning}
            >
              <FaQrcode />
              {scanning ? "Scanning..." : "Scan Image"}
            </button>

            <div id="cardvista-image-reader" className="hidden-reader" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Scansection;