import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from './Navbar';
import './Styles/Planets.css';


function EarthModel() {
  const earthRef = useRef();
  const earthTexture = new THREE.TextureLoader().load('/textures/earth.png');
  const earthCloudsTexture = new THREE.TextureLoader().load('/textures/earthClouds.png');

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsedTime * 0.05; // Earth rotation
  });

  return (
    <group>
      {/* Earth Sphere */}
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>

      {/* Optional: Earth clouds layer */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[10.1, 64, 64]} />
        <meshStandardMaterial map={earthCloudsTexture} transparent opacity={0.3} />
      </mesh>

      <pointLight color="white" intensity={1.5} distance={1000} decay={2} />
    </group>
  );
}

// Updated Satellite component without category control
function SatelliteModel({ modelPath, label, orbitRadius = 15, orbitSpeed = 0.5, scale = 0.5, inclination = 0, showLabel }) {
  const satelliteRef = useRef();
  const { scene } = useGLTF(modelPath);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * orbitSpeed;
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);

    satelliteRef.current.position.set(x, orbitRadius * Math.sin(inclination), z);
    satelliteRef.current.rotation.y = -angle;
  });

  return (
    <group ref={satelliteRef}>
      <primitive object={scene} scale={scale} />
      {showLabel && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}


function Asteroid({ texture, orbitRadius, orbitSpeed, size, name, showLabel, category }) {
  const asteroidRef = useRef();
  const asteroidTexture = useLoader(THREE.TextureLoader, texture);


  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(size, 1);
    const positionAttribute = geo.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      vertex.normalize().multiplyScalar(size * (1 + 0.2 * Math.random()));
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geo.computeVertexNormals();
    return geo;
  }, [size]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * orbitSpeed;
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);

    asteroidRef.current.position.set(x, 0, z);
    asteroidRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={asteroidRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial map={asteroidTexture} roughness={0.8} />
      </mesh>
      {showLabel && (
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`${name} (${category})`}
        </Text>
      )}
    </group>
  );
}

function AquaSatelliteModel() {
  const { scene } = useGLTF('/3D-Objects/Aqua2.glb');
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 0, 1000);
  }, [camera]);

  return <primitive object={scene} scale={100} />;
}

function AuraSatelliteModel() {
  const { scene } = useGLTF('/3D-Objects/Aura.glb');
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(20, -400, 50);
  }, [camera]);

  return <primitive object={scene} scale={20} />;
}

function HubbleTelescopeModel() {
  const { scene } = useGLTF('/3D-Objects/HubbleSpaceTelescope2.glb');
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 0, 3);
  }, [camera]);

  return <primitive object={scene} scale={0.006} />;
}

function AsteroidModel() {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 0, 3);
  }, [camera]);

  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="gray" roughness={0.7} />
    </mesh>
  );
}

const Earth = () => {
  const [showLabels, setShowLabels] = useState(false);
  const [showNEOs, setShowNEOs] = useState(true);
  const [showNECs, setShowNECs] = useState(true);
  const [showPHAs, setShowPHAs] = useState(true);

  const satellites = [
    { modelPath: "/3D-Objects/Aqua2.glb", label: "Aqua Satellite", orbitRadius: 15, orbitSpeed: 0.5, scale: 0.25, inclination: 0 },
    { modelPath: "/3D-Objects/Aura.glb", label: "Aura Satellite", orbitRadius: 20, orbitSpeed: 0.4, scale: 0.2, inclination: 0 },
    { modelPath: "/3D-Objects/HubbleSpaceTelescope2.glb", label: "Hubble Telescope", orbitRadius: 13, orbitSpeed: 6.2832 / 95, scale: 0.005, inclination: -10 },
  ];

  const asteroids = [
    { texture: "/textures/Asteroid.png", orbitRadius: 30, orbitSpeed: 0.05, size: 1, name: "99942 Apophis", category: "PHA" },
    { texture: "/textures/Asteroid.png", orbitRadius: 35, orbitSpeed: 0.025, size: 1.2, name: "433 Eros", category: "NEO" },
    { texture: "/textures/Asteroid.png", orbitRadius: 40, orbitSpeed: 0.075, size: 1.5, name: "101955 Bennu", category: "PHA" },
    { texture: "/textures/Asteroid.png", orbitRadius: 45, orbitSpeed: 0.05, size: 1.3, name: "Halley's Comet", category: "NEC" },
  ];

  return (
    <div className="planet-container">
      <Navbar />
      <Canvas className="planet-canvas" camera={{ position: [0, 0, 30], fov: 75 }}>
        <ambientLight intensity={1} />
        <Stars radius={300} depth={50} count={5000} factor={7} saturation={0.1} fade />
        <EarthModel />

        {/* Always show satellites */}
        {satellites.map((sat, index) => (
          <SatelliteModel
            key={index}
            {...sat}
            showLabel={showLabels}
          />
        ))}

        {/* Control asteroids visibility based on category switches */}
        {asteroids.map((asteroid, index) => (
          ((showNEOs && asteroid.category === "NEO") ||
           (showNECs && asteroid.category === "NEC") ||
           (showPHAs && asteroid.category === "PHA")) && (
            <Asteroid
              key={index}
              {...asteroid}
              showLabel={showLabels}
            />
          )
        ))}

        <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} minDistance={15} maxDistance={50} />
      </Canvas>

      <div className="switch-container">
        <div className="switch-group">
          <label htmlFor="toggle-labels">Show Labels</label>
          <input
            type="checkbox"
            id="toggle-labels"
            checked={showLabels}
            onChange={() => setShowLabels((prev) => !prev)}
          />
        </div>
        <div className="switch-group">
          <label htmlFor="toggle-neos">Show NEOs</label>
          <input
            type="checkbox"
            id="toggle-neos"
            checked={showNEOs}
            onChange={() => setShowNEOs((prev) => !prev)}
          />
        </div>
        <div className="switch-group">
          <label htmlFor="toggle-necs">Show NECs</label>
          <input
            type="checkbox"
            id="toggle-necs"
            checked={showNECs}
            onChange={() => setShowNECs((prev) => !prev)}
          />
        </div>
        <div className="switch-group">
          <label htmlFor="toggle-phas">Show PHAs</label>
          <input
            type="checkbox"
            id="toggle-phas"
            checked={showPHAs}
            onChange={() => setShowPHAs((prev) => !prev)}
          />
        </div>
      </div>

      {/* Scrollable content for Earth info */}
      <div className="planet-info-overlay">
        <div className="info-section">
          <h2>About Earth</h2>
          <p>Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of Earth's surface is covered with water, and its atmosphere contains oxygen and nitrogen, making it suitable for life.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>Earth's structure consists of the crust, mantle, outer core, and inner core. The crust is solid rock, while the mantle is semi-fluid. The outer core is molten iron and nickel, and the inner core is solid iron and nickel.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>While Earth is the home to humanity, space exploration has allowed for observation and study of our planet from space. Earth observation satellites provide valuable data on climate, weather, and environmental changes.</p>
        </div>
      </div>
    </div>
  );
};

export default Earth;