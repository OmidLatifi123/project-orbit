import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import Navbar from './Navbar';
import './Styles/Planets.css';

function MercuryModel() {
  const mercuryRef = useRef();
  const mercuryTexture = new THREE.TextureLoader().load('/textures/mercury.png'); // Mercury texture

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    mercuryRef.current.rotation.y = elapsedTime * 0.05; // Mercury rotation speed
  });

  return (
    <mesh ref={mercuryRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} /> {/* Mercury size */}
      <meshStandardMaterial map={mercuryTexture} />
      <pointLight color="white" intensity={2} distance={1000} decay={2} />
    </mesh>
  );
}

const Mercury = () => {
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

        <MercuryModel />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>

  
      <div className="planet-info-overlay">
      <div className="planet-info">
        <div className="info-section">
          <h2>About Mercury</h2>
          <p>Mercury is the smallest planet in the Solar System and the closest to the Sun. It has a thin atmosphere and extreme temperature fluctuations, ranging from very hot to very cold.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>Mercury is composed mostly of iron, making it the densest planet in the Solar System. Its surface is covered in craters, and it has no moons or rings.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>Mercury has been explored by spacecraft such as Mariner 10 and MESSENGER, which have provided valuable data about its surface, atmosphere, and magnetic field.</p>
        </div>
      </div>
    </div>
    </div>

  );
};

export default Mercury;
