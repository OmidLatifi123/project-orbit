import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import Navbar from './Navbar';
import './Styles/Planets.css';

function JupiterModel() {
  const jupiterRef = useRef();
  const jupiterTexture = new THREE.TextureLoader().load('/textures/jupiter.png'); // Jupiter texture

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    jupiterRef.current.rotation.y = elapsedTime * 0.05; // Jupiter rotation speed
  });

  return (
    <mesh ref={jupiterRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} /> {/* Jupiter size */}
      <meshStandardMaterial map={jupiterTexture} />
      <pointLight color="white" intensity={2} distance={1000} decay={2} />
    </mesh>
  );
}

const Jupiter = () => {
  return (
    <div className="planet-container">
      <Navbar />
      <Canvas className='ca' camera={{ position: [0, 0, 30], fov: 75 }}>
        <ambientLight intensity={1} />

    
        <Stars 
          radius={300}       
          depth={50}        
          count={5000}       
          factor={7}         
          saturation={0.1}   
          fade={true}         
        />

        <JupiterModel />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>

      {/* Scrollable content with glassy text containers */}
      <div className="planet-info-overlay">
      <div className="planet-info">
        <div className="info-section">
          <h2>About Jupiter</h2>
          <p>Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than twice that of all the other planets combined. It has a famous feature, the Great Red Spot, a storm larger than Earth.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>Jupiter is composed primarily of hydrogen and helium. Its atmosphere is marked by large storm systems, including the Great Red Spot, and it has faint planetary rings made of dust particles.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>Jupiter has been visited by several spacecraft, including Pioneer, Voyager, Galileo, and Juno. These missions have revealed much about its composition, weather, and the many moons that orbit it.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Jupiter;
