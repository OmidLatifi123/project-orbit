import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import Navbar from './Navbar';
import './Styles/Planets.css';

function UranusModel() {
  const uranusRef = useRef();
  const ringsRef = useRef();
  const uranusTexture = new THREE.TextureLoader().load('/textures/uranus.png'); 
  const ringsTexture = new THREE.TextureLoader().load('/textures/uranusRing.png'); 

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    uranusRef.current.rotation.y = elapsedTime * 0.05; 
    ringsRef.current.rotation.x = Math.PI / 2; 
  });

  return (
    <group>
      {/* Uranus Sphere */}
      <mesh ref={uranusRef} position={[0, 0, 0]}>
        <sphereGeometry args={[10, 64, 64]} /> {/* Uranus size */}
        <meshStandardMaterial map={uranusTexture} />
      </mesh>

      {/* Uranus Rings */}
      <mesh ref={ringsRef} position={[0, 0, 0]}>
        <ringGeometry args={[12, 15, 64]} /> {/* Inner and outer radius for the rings */}
        <meshBasicMaterial map={ringsTexture} side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>

      <pointLight color="white" intensity={2} distance={1000} decay={2} />
    </group>
  );
}

const Uranus = () => {
  return (
    <div className="planet-container">
      <Navbar />
      <Canvas camera={{ position: [0, 0, 40], fov: 75 }}>
        <ambientLight intensity={1} />

     
        <Stars 
          radius={300}        
          depth={50}         
          count={5000}        
          factor={7}         
          saturation={0.1}    
          fade={true}         
        />

        <UranusModel />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>


      <div className="planet-info-overlay">
      <div className="planet-info">
        <div className="info-section">
          <h2>About Uranus</h2>
          <p>Uranus is the seventh planet from the Sun and has the third-largest planetary radius and fourth-largest planetary mass in the Solar System. It has a blue-green color due to methane in its atmosphere and is unique in that it rotates on its side.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>Uranus's atmosphere is primarily composed of hydrogen and helium, with a small amount of methane. Its interior consists of a rocky core, surrounded by an icy mantle of water, ammonia, and methane ices.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>Uranus has only been visited once, by the Voyager 2 spacecraft in 1986. Voyager 2 provided the first detailed images and information about Uranus's rings, moons, and its tilted magnetic field.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Uranus;
