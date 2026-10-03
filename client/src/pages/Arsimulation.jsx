import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Environment,
  Text
} from "@react-three/drei";

import {
  FaArrowLeft,
  FaCube,
  FaExpand,
  FaRedo,
  FaUserCircle,
  FaVolumeUp,
  FaPalette,
  FaGlobe,
  FaPlay,
  FaStop,
  FaPlus,
  FaMinus,
  FaSyncAlt,
  FaIdCard,
  FaCheckCircle
} from "react-icons/fa";

const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const themes = {
  Cyan: {
    primary: "#42dfff",
    secondary: "#0b6d8c",
    glow: "#00d9ff"
  },

  Blue: {
    primary: "#5795ff",
    secondary: "#174b9c",
    glow: "#3178ff"
  },

  Violet: {
    primary: "#b678ff",
    secondary: "#6331a5",
    glow: "#9b4dff"
  },

  Emerald: {
    primary: "#4de5ad",
    secondary: "#197653",
    glow: "#20d695"
  },

  Amber: {
    primary: "#ffc45c",
    secondary: "#9b6417",
    glow: "#ffae22"
  }
};

function CardMesh({
  card,
  theme,
  rotation,
  scale,
  autoRotate,
  active
}) {
  const selectedTheme = themes[theme];
  const groupRef = useRef();

  const displayName =
    typeof card?.name === "string" && card.name.trim()
      ? card.name.trim()
      : "Your Name";

  const designation =
    typeof card?.designation === "string" &&
    card.designation.trim()
      ? card.designation.trim()
      : "Your Designation";

  const company =
    typeof card?.company === "string" && card.company.trim()
      ? card.company.trim()
      : "Your Company";

  const email =
    typeof card?.email === "string" && card.email.trim()
      ? card.email.trim()
      : "email@example.com";

  const phone =
    typeof card?.phone === "string" && card.phone.trim()
      ? card.phone.trim()
      : "+91 XXXXX XXXXX";

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.65;
    }
  });

  return (
    <Float
      speed={active ? 2 : 0.8}
      rotationIntensity={autoRotate ? 0.03 : 0.04}
      floatIntensity={active ? 0.35 : 0.1}
    >
      <group
        ref={groupRef}
        rotation={[0, rotation, 0]}
        scale={scale}
      >
        <mesh>
          <boxGeometry args={[5.8, 3.4, 0.16]} />
          <meshStandardMaterial
            color="#07131d"
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>

        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[5.55, 3.15]} />
          <meshStandardMaterial
            color="#07131d"
            metalness={0.4}
            roughness={0.25}
            emissive={selectedTheme.glow}
            emissiveIntensity={active ? 0.12 : 0.05}
          />
        </mesh>

        <mesh
          position={[0, 0, -0.095]}
          rotation={[0, Math.PI, 0]}
        >
          <planeGeometry args={[5.55, 3.15]} />
          <meshStandardMaterial
            color="#050b11"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[-2.15, 1.05, 0.18]}>
          <boxGeometry args={[1, 0.12, 0.04]} />
          <meshStandardMaterial
            color={selectedTheme.primary}
            emissive={selectedTheme.glow}
            emissiveIntensity={0.8}
          />
        </mesh>

        <mesh position={[-2.15, -1.05, 0.18]}>
          <boxGeometry args={[1, 0.06, 0.04]} />
          <meshStandardMaterial
            color={selectedTheme.primary}
            emissive={selectedTheme.glow}
            emissiveIntensity={0.6}
          />
        </mesh>

        <mesh position={[2.15, -1.05, 0.18]}>
          <boxGeometry args={[0.65, 0.06, 0.04]} />
          <meshStandardMaterial
            color={selectedTheme.primary}
            emissive={selectedTheme.glow}
            emissiveIntensity={0.6}
          />
        </mesh>

        <mesh position={[-1.95, 0.25, 0.18]}>
          <circleGeometry args={[0.52, 48]} />
          <meshStandardMaterial
            color={selectedTheme.secondary}
            emissive={selectedTheme.glow}
            emissiveIntensity={0.3}
          />
        </mesh>

        <mesh position={[-1.95, 0.25, 0.195]}>
          <circleGeometry args={[0.38, 48]} />
          <meshStandardMaterial
            color="#07131d"
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>

        <Text
          position={[1.65, 1.22, 0.21]}
          fontSize={0.16}
          color={selectedTheme.primary}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          CARDVISTA
        </Text>

        <Text
          position={[-0.55, 0.72, 0.21]}
          fontSize={0.34}
          maxWidth={3.35}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
        >
          {displayName}
        </Text>

        <Text
          position={[-0.55, 0.39, 0.21]}
          fontSize={0.19}
          maxWidth={3.2}
          color={selectedTheme.primary}
          anchorX="left"
          anchorY="middle"
        >
          {designation}
        </Text>

        <Text
          position={[-0.55, 0.12, 0.21]}
          fontSize={0.16}
          maxWidth={3}
          color="#8ca3b0"
          anchorX="left"
          anchorY="middle"
        >
          {company}
        </Text>

        <mesh position={[0.85, -0.13, 0.21]}>
          <boxGeometry args={[2.8, 0.025, 0.025]} />
          <meshStandardMaterial
            color={selectedTheme.primary}
            emissive={selectedTheme.glow}
            emissiveIntensity={0.6}
          />
        </mesh>

        <Text
          position={[-1.05, -0.48, 0.21]}
          fontSize={0.14}
          maxWidth={2.7}
          color="#d6e3ea"
          anchorX="left"
          anchorY="middle"
        >
          {email}
        </Text>

        <Text
          position={[-1.05, -0.75, 0.21]}
          fontSize={0.14}
          maxWidth={2.7}
          color="#8ca3b0"
          anchorX="left"
          anchorY="middle"
        >
          {phone}
        </Text>

        <Text
          position={[1.65, -0.62, 0.21]}
          fontSize={0.11}
          color={selectedTheme.primary}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          DIGITAL IDENTITY
        </Text>

        <mesh position={[1.45, -1.02, 0.18]}>
          <boxGeometry args={[1.65, 0.05, 0.04]} />
          <meshStandardMaterial
            color={selectedTheme.primary}
            emissive={selectedTheme.glow}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({
  card,
  theme,
  rotation,
  scale,
  autoRotate,
  active,
  environment
}) {
  return (
    <>
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 6, 8]}
        intensity={3}
      />

      <pointLight
        position={[-4, 2, 5]}
        intensity={25}
        distance={12}
        color={themes[theme].glow}
      />

      <pointLight
        position={[4, -2, 3]}
        intensity={12}
        distance={10}
        color="#ffffff"
      />

      <CardMesh
        card={card}
        theme={theme}
        rotation={rotation}
        scale={scale}
        autoRotate={autoRotate}
        active={active}
      />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={12}
        enableDamping
        dampingFactor={0.06}
      />

      <Environment
        preset={
          environment === "Outdoor"
            ? "park"
            : environment === "Night City"
              ? "night"
              : environment === "Office"
                ? "city"
                : "studio"
        }
      />
    </>
  );
}

function Arsimulation() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);

  const [environment, setEnvironment] = useState("Studio");
  const [theme, setTheme] = useState("Cyan");
  const [background, setBackground] = useState("Particles");

  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingCards, setLoadingCards] = useState(true);
  const [notification, setNotification] = useState("");

  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 2200);
  };

  const fetchCards = async () => {
    try {
      setLoadingCards(true);

      const response = await fetch(`${apiUrl}/cards`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch cards"
        );
      }

      const fetchedCards = data.cards || [];

      setCards(fetchedCards);

      if (fetchedCards.length > 0) {
        setSelectedCardId(fetchedCards[0]._id);
        setSelectedCard(fetchedCards[0]);
      }
    } catch (error) {
      console.error(error);
      showNotification("Unable to load saved cards");
    } finally {
      setLoadingCards(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const card = cards.find(
      (item) => item._id === selectedCardId
    );

    setSelectedCard(card || null);
  }, [selectedCardId, cards]);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCardChange = (event) => {
    const id = event.target.value;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setSelectedCardId(id);
    setRotation(0);
    setScale(1);

    const card = cards.find(
      (item) => item._id === id
    );

    if (card) {
      showNotification(`${card.name}'s card selected`);
    }
  };

  const handleFlip = () => {
    setRotation((current) =>
      current + Math.PI
    );

    showNotification("Card flipped");
  };

  const handleZoomIn = () => {
    setScale((current) =>
      Math.min(current + 0.1, 1.6)
    );

    showNotification("Zoomed in");
  };

  const handleZoomOut = () => {
    setScale((current) =>
      Math.max(current - 0.1, 0.7)
    );

    showNotification("Zoomed out");
  };

  const handleReset = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setRotation(0);
    setScale(1);
    setAutoRotate(false);
    setIsARActive(false);
    setEnvironment("Studio");
    setTheme("Cyan");
    setBackground("Particles");

    showNotification("AR scene reset");
  };

  const handleVoice = () => {
    if (!("speechSynthesis" in window)) {
      showNotification(
        "Voice is not supported by this browser"
      );
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      showNotification("Voice stopped");
      return;
    }

    if (!selectedCard) {
      showNotification("Select a saved card first");
      return;
    }

    const text = `
      CardVista digital visiting card.
      Name: ${selectedCard.name || "Not available"}.
      Designation: ${
        selectedCard.designation || "Not available"
      }.
      Company: ${
        selectedCard.company || "Not available"
      }.
      Email: ${
        selectedCard.email || "Not available"
      }.
      Phone: ${
        selectedCard.phone || "Not available"
      }.
    `;

    const speech =
      new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.pitch = 1;

    speech.onstart = () => {
      setIsSpeaking(true);
      showNotification("Voice preview started");
    };

    speech.onend = () => {
      setIsSpeaking(false);
      showNotification("Voice preview completed");
    };

    speech.onerror = () => {
      setIsSpeaking(false);
      showNotification("Voice preview stopped");
    };

    window.speechSynthesis.speak(speech);
  };

  const handleAR = () => {
    setIsARActive((current) => !current);

    if (!isARActive) {
      showNotification("AR experience started");
    } else {
      showNotification("AR experience stopped");
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen((current) => !current);
  };

  return (
    <section
      className={`dashboard-section section ar-section ${
        isFullscreen ? "ar-fullscreen-active" : ""
      }`}
    >
      <div className="section-container">
        {!isFullscreen && (
          <>
            <div className="page-top">
              <button
                className="back-button"
                onClick={() => navigate("/dashboard")}
              >
                <FaArrowLeft />
                Dashboard
              </button>
            </div>

            <div className="page-heading">
              <span className="section-label">
                THREE.JS WEBAR
              </span>

              <h1>AR Card Simulation</h1>

              <p>
                Select a saved CardVista card and
                explore it through an interactive
                Three.js 3D experience.
              </p>
            </div>
          </>
        )}

        <div className="ar-layout">
          <div
            className={`ar-viewer environment-${environment
              .toLowerCase()
              .replace(/\s+/g, "-")} background-${background
              .toLowerCase()
              .replace(/\s+/g, "-")} ${
              isARActive ? "ar-active" : ""
            }`}
          >
            <div className="ar-viewer-topbar">
              <div className="ar-live-status">
                <span className="ar-status-dot" />

                {isARActive
                  ? "AR ACTIVE"
                  : "3D SIMULATION"}
              </div>

              <button
                className="ar-fullscreen-button"
                onClick={handleFullscreen}
              >
                <FaExpand />
              </button>
            </div>

            <div className="ar-background">
              {background !== "Minimal" && (
                <>
                  <div className="ar-particle particle-one" />
                  <div className="ar-particle particle-two" />
                  <div className="ar-particle particle-three" />
                  <div className="ar-particle particle-four" />
                  <div className="ar-particle particle-five" />
                  <div className="ar-particle particle-six" />
                  <div className="ar-particle particle-seven" />
                  <div className="ar-particle particle-eight" />
                </>
              )}

              <div className="three-canvas-wrapper">
                <Canvas
                  camera={{
                    position: [0, 0, 8],
                    fov: 45
                  }}
                  dpr={[1, 2]}
                >
                  <Scene
                    card={selectedCard}
                    theme={theme}
                    rotation={rotation}
                    scale={scale}
                    autoRotate={autoRotate}
                    active={isARActive}
                    environment={environment}
                  />
                </Canvas>
              </div>
            </div>

            <div className="ar-controls">
              <button onClick={handleFlip}>
                <FaSyncAlt />
                Flip
              </button>

              <button onClick={handleZoomOut}>
                <FaMinus />
                Zoom Out
              </button>

              <button onClick={handleZoomIn}>
                <FaPlus />
                Zoom In
              </button>

              <button
                onClick={() =>
                  setAutoRotate(
                    (current) => !current
                  )
                }
              >
                <FaSyncAlt />

                {autoRotate
                  ? "Stop Rotate"
                  : "Auto Rotate"}
              </button>

              <button onClick={handleVoice}>
                {isSpeaking ? (
                  <FaStop />
                ) : (
                  <FaVolumeUp />
                )}

                {isSpeaking
                  ? "Stop Voice"
                  : "Voice"}
              </button>

              <button onClick={handleReset}>
                <FaRedo />
                Reset
              </button>
            </div>
          </div>

          {!isFullscreen && (
            <div className="ar-settings">
              <div className="ar-settings-header">
                <div className="ar-settings-icon">
                  <FaCube />
                </div>

                <div>
                  <h2>AR Scene</h2>

                  <p>
                    Configure your CardVista
                    3D experience.
                  </p>
                </div>
              </div>

              <div className="ar-card-selector">
                <label>
                  <FaIdCard />
                  Select Saved Card
                </label>

                {loadingCards ? (
                  <div className="ar-loading-card">
                    Loading saved cards...
                  </div>
                ) : cards.length === 0 ? (
                  <div className="ar-empty-card">
                    <p>No saved cards found.</p>

                    <button
                      className="secondary-button"
                      onClick={() =>
                        navigate(
                          "/dashboard/upload"
                        )
                      }
                    >
                      Create Card
                    </button>
                  </div>
                ) : (
                  <select
                    value={selectedCardId}
                    onChange={handleCardChange}
                  >
                    {cards.map((card) => (
                      <option
                        key={card._id}
                        value={card._id}
                      >
                        {card.name}
                        {card.company
                          ? ` — ${card.company}`
                          : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedCard && (
                <div className="ar-selected-card-info">
                  <div className="ar-mini-avatar">
                    <FaUserCircle />
                  </div>

                  <div>
                    <strong>
                      {selectedCard.name}
                    </strong>

                    <span>
                      {selectedCard.designation ||
                        "Digital Visiting Card"}
                    </span>

                    <small>
                      {selectedCard.company ||
                        "CardVista"}
                    </small>
                  </div>

                  <FaCheckCircle />
                </div>
              )}

              <div className="setting-group">
                <label>
                  <FaGlobe />
                  Environment
                </label>

                <select
                  value={environment}
                  onChange={(event) =>
                    setEnvironment(event.target.value)
                  }
                >
                  <option>Studio</option>
                  <option>Office</option>
                  <option>Conference</option>
                  <option>Outdoor</option>
                  <option>Night City</option>
                </select>
              </div>

              <div className="setting-group">
                <label>
                  <FaPalette />
                  Theme Color
                </label>

                <select
                  value={theme}
                  onChange={(event) =>
                    setTheme(event.target.value)
                  }
                >
                  <option>Cyan</option>
                  <option>Blue</option>
                  <option>Violet</option>
                  <option>Emerald</option>
                  <option>Amber</option>
                </select>
              </div>

              <div className="setting-group">
                <label>
                  <FaCube />
                  Background Effect
                </label>

                <select
                  value={background}
                  onChange={(event) =>
                    setBackground(event.target.value)
                  }
                >
                  <option>Particles</option>
                  <option>Glow</option>
                  <option>Grid</option>
                  <option>Stars</option>
                  <option>Minimal</option>
                </select>
              </div>

              <button
                className="primary-button ar-start-button"
                onClick={handleAR}
                disabled={!selectedCard}
              >
                {isARActive ? (
                  <FaStop />
                ) : (
                  <FaPlay />
                )}

                {isARActive
                  ? "Stop AR Experience"
                  : "Start AR Experience"}
              </button>

              <button
                className="secondary-button ar-reset-button"
                onClick={handleReset}
              >
                <FaRedo />
                Reset Scene
              </button>
            </div>
          )}
        </div>

        {notification && (
          <div className="ar-notification">
            <span className="ar-status-dot" />
            {notification}
          </div>
        )}
      </div>
    </section>
  );
}

export default Arsimulation;