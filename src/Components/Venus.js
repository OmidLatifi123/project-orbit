import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import Navbar from './Navbar';
import './Styles/Planets.css';

function VenusModel() {
  const venusRef = useRef();
  const venusTexture = new THREE.TextureLoader().load('/textures/venus.png'); // Venus texture

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    venusRef.current.rotation.y = elapsedTime * 0.05; // Venus rotation speed
  });

  return (
    <mesh ref={venusRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} /> {/* Venus size */}
      <meshStandardMaterial map={venusTexture} />
      <pointLight color="yellow" intensity={2} distance={1000} decay={2} />
    </mesh>
  );
}

const Venus = () => {
  return (
    <div className="planet-container">
        <Navbar />
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <ambientLight intensity={1} />
        

        <Stars 
          radius={300}      
          depth={50}       
          count={5000}      
          factor={7}       
          saturation={0.1}    
          fade={true}        
        />

        <VenusModel />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>


      <div className="planet-info-overlay">
      <div className="planet-info">
        <div className="info-section">
          <h2>About Venus</h2>
          <p>Venus is the second planet from the Sun and is often called Earth's twin due to its similar size and mass. It has a dense atmosphere of carbon dioxide, with clouds of sulfuric acid, making it the hottest planet in the Solar System.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>Venus has a rocky body, similar to Earth. Its surface is covered with volcanoes, mountains, and vast plains. Its atmosphere is thick with carbon dioxide, which traps heat in a runaway greenhouse effect.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>Venus has been explored by several space missions, including NASA's Magellan and the Soviet Union's Venera missions. These missions have revealed much about its surface and atmosphere.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Venus;
