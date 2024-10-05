import React, { useRef, useState } from 'react'; 
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars, useGLTF, Text } from '@react-three/drei'; 
import Navbar from './Navbar';
import './Styles/Planets.css';
function MarsModel() {
  const marsRef = useRef();
  const marsTexture = new THREE.TextureLoader().load('/textures/mars.png'); 

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    marsRef.current.rotation.y = elapsedTime * 0.05; 
  });

  return (
    <mesh ref={marsRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} /> {/* Mars size */}
      <meshStandardMaterial map={marsTexture} />
      <pointLight color="orange" intensity={2} distance={1000} decay={2} />
    </mesh>
  );
}

// Satellite Model Component for Mars Orbiters with label support
function SatelliteModel({ modelPath, orbitRadius, orbitSpeed, scale = 0.25, inclination = 0, label, showLabel }) {
  const satelliteRef = useRef();
  const { scene } = useGLTF(modelPath); // Satellite model loader

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * orbitSpeed; // Adjust orbit speed based on the period
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);

    satelliteRef.current.position.set(x, orbitRadius * Math.sin(inclination), z); // Keep satellite rotating around Mars
    satelliteRef.current.rotation.y = -angle; // Adjust rotation to face forward
  });

  return (
    <group ref={satelliteRef}>
      <primitive object={scene} scale={scale} />
      {showLabel && (
        <Text
          position={[0, scale + 1, 0]} 
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

const Mars = () => {
  const [showLabels, setShowLabels] = useState(false); 

  return (
    <div className="planet-container">
      <Navbar />
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <ambientLight intensity={1.3} />

        {/* Stars background */}
        <Stars 
          radius={300}        
          depth={50}          
          count={5000}        
          factor={7}          
          saturation={0.1}    
          fade={true}         
        />

        <MarsModel />

        {/* Mars Odyssey Satellite with label */}
        <SatelliteModel
          modelPath="/3D-Objects/MarsOdyssey.glb"
          orbitRadius={15} 
          orbitSpeed={6.2832 / 120} // Orbital period of Mars Odyssey
          scale={0.3} 
          inclination={0.5} 
          label="Mars Odyssey"
          showLabel={showLabels}
        />

        {/* Mars Reconnaissance Orbiter Satellite with label */}
        <SatelliteModel
          modelPath="/3D-Objects/MarsReconnaissanceOrbiter.glb"
          orbitRadius={15} 
          orbitSpeed={6.2832 / 112} 
          scale={0.04} 
          inclination={0.05} 
          label="Mars Reconnaissance Orbiter"
          showLabel={showLabels}
        />

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>

      {/* Switch for showing labels */}
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
      </div>

      {/* Scrollable content for Mars info */}
      <div className="planet-info-overlay">
        <div className="planet-info">
          <div className="info-section">
            <h2>About Mars</h2>
            <p>Mars is the fourth planet from the Sun and is known as the Red Planet due to its reddish appearance, which is caused by iron oxide (rust) on its surface. Mars is a cold desert world with a thin atmosphere.</p>
          </div>
          <div className="info-section">
            <h2>Composition</h2>
            <p>Mars is composed primarily of rock and iron, with a thin atmosphere composed mostly of carbon dioxide. Its surface features include craters, volcanoes, valleys, and polar ice caps.</p>
          </div>
          <div className="info-section">
            <h2>Exploration</h2>
            <p>Mars has been a key target for exploration, with missions from NASA, ESA, and other space agencies. Rovers like Curiosity, Perseverance, and the Ingenuity helicopter have explored its surface, searching for signs of past life.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mars;