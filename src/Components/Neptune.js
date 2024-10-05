import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import Navbar from './Navbar';
import './Styles/Planets.css';

function NeptuneModel() {
  const neptuneRef = useRef();
  const neptuneTexture = new THREE.TextureLoader().load('/textures/neptune.png'); // Neptune texture

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    neptuneRef.current.rotation.y = elapsedTime * 0.05; // Neptune rotation speed
  });

  return (
    <mesh ref={neptuneRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} /> 
      <meshStandardMaterial map={neptuneTexture} />
      <pointLight color="blue" intensity={2} distance={1000} decay={2} />
    </mesh>
  );
}

const Neptune = () => {
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

        <NeptuneModel />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>

   
      <div className="planet-info-overlay">
      <div className="planet-info">
        <div className="info-section">
          <h2>About Neptune</h2>
          <p>Neptune is the eighth and farthest known planet from the Sun in the Solar System. It is the fourth-largest planet by diameter and the third-most-massive planet. Neptune is a gas giant, primarily composed of hydrogen and helium.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>Neptune is primarily composed of hydrogen, helium, and methane. The methane in its atmosphere gives it a blue color. Like Uranus, it has a core of rock and ice, surrounded by a thick atmosphere.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>Neptune has been visited by only one spacecraft: NASA's Voyager 2 in 1989. Voyager 2 provided detailed images and information about the planet, its rings, and its moons.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Neptune;
