// GalaxyScene.js
import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Navbar from './Navbar';
import '../Components/Styles/App.css';

// Orbit Path Component (white line for the trajectory)
function OrbitPath({ radius }) {
  const orbitRef = useRef();

  useFrame(() => {
    orbitRef.current.rotation.x = Math.PI / 2;
  });

  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={orbitRef}>
      <bufferGeometry attach="geometry" {...orbitGeometry} />
      <lineBasicMaterial attach="material" color="white" linewidth={1} />
    </line>
  );
}

// Reusable Planet Component with orbit
function Planet({ texture, size, distanceFromSun, orbitSpeed, spinSpeed, children, showTrajectory }) {
  const planetRef = useRef();
  const orbitRef = useRef();
  const planetTexture = useLoader(THREE.TextureLoader, texture);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    planetRef.current.rotation.y = elapsedTime * spinSpeed;
    orbitRef.current.rotation.y = elapsedTime * orbitSpeed;
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={planetRef} position={[distanceFromSun, 0, 0]}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={planetTexture} />
        {children}
      </mesh>
      {showTrajectory && <OrbitPath radius={distanceFromSun} />}
    </group>
  );
}

// Moon Component
function Moon({ texture, size, distanceFromPlanet, orbitSpeed, spinSpeed }) {
  const moonRef = useRef();
  const orbitRef = useRef();
  const moonTexture = useLoader(THREE.TextureLoader, '/textures/Moon.png');

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    moonRef.current.rotation.y = elapsedTime * spinSpeed;
    orbitRef.current.rotation.y = elapsedTime * orbitSpeed;
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={moonRef} position={[distanceFromPlanet, 0, 0]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={moonTexture} />
      </mesh>
    </group>
  );
}

// Sun Component
function Sun({ glow }) {
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/sun.png');
  const sunRef = useRef();

  sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
  sunTexture.repeat.set(4, 4);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    sunRef.current.rotation.y = elapsedTime * 0.05;
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive={glow ? new THREE.Color(0xff4500) : null}
        emissiveIntensity={glow ? 1.5 : 0}
        emissiveMap={glow ? sunTexture : null}
      />
    </mesh>
  );
}

// Saturn Rings Component
function SaturnRings({ size }) {
  const ringTexture = useLoader(THREE.TextureLoader, '/textures/saturnRing.png');
  const ringsRef = useRef();

  useFrame(() => {
    ringsRef.current.rotation.x = Math.PI / 2;
  });

  const innerRadius = size * 1.2;
  const outerRadius = size * 2;

  return (
    <mesh ref={ringsRef}>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial map={ringTexture} side={THREE.DoubleSide} transparent={true} opacity={0.8} />
    </mesh>
  );
}

// Galaxy Component
function Galaxy({ realSize, realDistance, showTrajectory }) {
  const sizeMultiplier = realSize ? 1 : 3;
  const distanceMultiplier = realDistance ? 1 : 0.75;

  const baseDistance = 60;

  const planetData = [
    { name: 'Mercury', size: 1, distance: baseDistance, orbitSpeed: 0.4, spinSpeed: 1 / 58.65 },
    { name: 'Venus', size: 1.5, distance: baseDistance * 1.5, orbitSpeed: 0.3, spinSpeed: 1 / 243 },
    { name: 'Earth', size: 2, distance: baseDistance * 2, orbitSpeed: 0.2, spinSpeed: 1 },
    { name: 'Mars', size: 1.2, distance: baseDistance * 2.5, orbitSpeed: 0.15, spinSpeed: 1 / 1.03 },
    { name: 'Jupiter', size: 3, distance: baseDistance * 3.5, orbitSpeed: 0.05, spinSpeed: 1 / 0.41 },
    { name: 'Saturn', size: 2.7, distance: baseDistance * 4.5, orbitSpeed: 0.03, spinSpeed: 1 / 0.45 },
    { name: 'Neptune', size: 3.88, distance: baseDistance * 6.0, orbitSpeed: 0.02, spinSpeed: 1 / 0.67 },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="orange" intensity={2} />
      <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade />

      <Sun glow={true} />

      {planetData.map((planet) => {
        if (planet.name === 'Earth') {
          return (
            <Planet
              key={planet.name}
              texture={`/textures/${planet.name.toLowerCase()}.png`}
              size={planet.size * sizeMultiplier}
              distanceFromSun={planet.distance * distanceMultiplier}
              orbitSpeed={planet.orbitSpeed * (realDistance ? 1 : 0.5)}
              spinSpeed={planet.spinSpeed * (realSize ? 1 : 0.5)}
              showTrajectory={showTrajectory}
            >
              <Moon
                texture="/textures/moon.png"
                size={0.27 * planet.size * sizeMultiplier}
                distanceFromPlanet={realSize ? 5 * sizeMultiplier : 4 * sizeMultiplier}
                orbitSpeed={0.5}
                spinSpeed={0.1}
              />
            </Planet>
          );
        } else if (planet.name === 'Saturn') {
          return (
            <Planet
              key={planet.name}
              texture={`/textures/${planet.name.toLowerCase()}.png`}
              size={planet.size * sizeMultiplier}
              distanceFromSun={planet.distance * distanceMultiplier}
              orbitSpeed={planet.orbitSpeed * (realDistance ? 1 : 0.5)}
              spinSpeed={planet.spinSpeed * (realSize ? 1 : 0.5)}
              showTrajectory={showTrajectory}
            >
              <SaturnRings size={planet.size * sizeMultiplier} />
            </Planet>
          );
        }
        return (
          <Planet
            key={planet.name}
            texture={`/textures/${planet.name.toLowerCase()}.png`}
            size={planet.size * sizeMultiplier}
            distanceFromSun={planet.distance * distanceMultiplier}
            orbitSpeed={planet.orbitSpeed * (realDistance ? 1 : 0.5)}
            spinSpeed={planet.spinSpeed * (realSize ? 1 : 0.5)}
            showTrajectory={showTrajectory}
          />
        );
      })}
    </>
  );
}

// Main Galaxy Scene Component
function GalaxyScene() {
  const [realSize, setRealSize] = useState(false);
  const [realDistance, setRealDistance] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(false);

  return (
    <div className="galaxy-container">
      <Navbar />
      <Canvas className="canvas-background" camera={{ position: [0, 150, 300], fov: 40 }}>
        <Galaxy realSize={realSize} realDistance={realDistance} showTrajectory={showTrajectory} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.85} intensity={1.2} />
        </EffectComposer>
        <OrbitControls enablePan={false} enableZoom={true} enableRotate={true} minDistance={50} maxDistance={200} />
      </Canvas>

      <div className="overlay-text">
        <h2>Welcome to our Solar System</h2>
      </div>

      <div className="switch-container">
        <div className="switch-group">
          <input
            type="checkbox"
            id="real-size"
            checked={realSize}
            onChange={(e) => setRealSize(e.target.checked)}
          />
          <label htmlFor="real-size">Real Size</label>
        </div>
        <div className="switch-group">
          <input
            type="checkbox"
            id="real-distance"
            checked={realDistance}
            onChange={(e) => setRealDistance(e.target.checked)}
          />
          <label htmlFor="real-distance">Real Distance</label>
        </div>
        <div className="switch-group">
          <input
            type="checkbox"
            id="rotation-trajectory"
            checked={showTrajectory}
            onChange={(e) => setShowTrajectory(e.target.checked)}
          />
          <label htmlFor="rotation-trajectory">Rotation Trajectory</label>
        </div>
      </div>
    </div>
  );
}

export default GalaxyScene;
