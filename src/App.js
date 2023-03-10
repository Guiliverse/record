import React, { Suspense, useState } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import useLocalStorage from "use-local-storage";

import Record from "./Record";

import "./styles.css";

export default function App() {
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  );
  const [isRotating, setIsRotating] = useState(false);

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const handleRotation = () => {
    setIsRotating(!isRotating);
  };

  const [cover, setCover] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [spine, setSpine] = useState(null);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(URL.createObjectURL(file));
    }
  };

  const handleMetadataChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMetadata(URL.createObjectURL(file));
    }
  };

  const handleSpineChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSpine(URL.createObjectURL(file));
    }
  };
  console.log(cover, spine, metadata);
  return (
    <div className="wrapper" data-theme={theme}>
      <div className="toolbar">
        <div className="artwork">
          <label htmlFor="cover">Select cover</label>
          <input
            id="cover"
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
          />
          <label htmlFor="metadata">Select metadata</label>
          <input
            id="metadata"
            type="file"
            accept="image/*"
            onChange={handleMetadataChange}
          />
          <label htmlFor="spine">Select spine</label>
          <input
            id="spine"
            type="file"
            accept="image/*"
            onChange={handleSpineChange}
          />
        </div>
        <div className="appearance">
          <button onClick={() => handleRotation()}>
            Rotate &nbsp;{isRotating ? "???" : "???"}
          </button>
          <button onClick={() => switchTheme()}>
            {theme === "light" ? "Dark" : "Light"} mode
          </button>
        </div>
      </div>
      <Canvas>
        <Suspense fallback={null}>
          <Environment preset="warehouse" />
          <Record cover={cover} spine={spine} metadata={metadata} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          autoRotate={isRotating}
          maxPolarAngle={1.5}
          minPolarAngle={1.5}
        />
      </Canvas>
    </div>
  );
}
