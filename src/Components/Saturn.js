import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import Navbar from './Navbar';
import './Styles/Planets.css';

function SaturnModel() {
  const saturnRef = useRef();
  const ringsRef = useRef();
  const saturnTexture = new THREE.TextureLoader().load('/textures/saturn.png'); // Saturn texture
  const ringsTexture = new THREE.TextureLoader().load('/textures/saturnRing.png'); // Rings texture

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    saturnRef.current.rotation.y = elapsedTime * 0.05;
    ringsRef.current.rotation.x = Math.PI / 2; 
  });

  return (
    <group>
      {/* Saturn Sphere */}
      <mesh ref={saturnRef} position={[0, 0, 0]}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial map={saturnTexture} />
      </mesh>

     
      <mesh ref={ringsRef} position={[0, 0, 0]}>
        <ringGeometry args={[12, 20, 64]} /> 
        <meshBasicMaterial map={ringsTexture} side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>

      <pointLight color="white" intensity={2} distance={1000} decay={2} />
    </group>
  );
}

const Saturn = () => {
  return (
    <div className="planet-container">
      <Navbar />
      <Canvas camera={{ position: [0, 2, 40], fov: 75 }}>
        <ambientLight intensity={1} />

   
        <Stars 
          radius={300}        
          depth={50}          
          count={5000}       
          factor={7}          
          saturation={0.1}    
          fade={true}         
        />

        <SaturnModel />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>

      {/* Scrollable content with glassy text containers */}
      <div className="planet-info">
        <div className="info-section">
          <h2>About Saturn</h2>
          <p>Saturn is the sixth planet from the Sun and is best known for its spectacular ring system, made mostly of ice and dust. It is a gas giant, composed mainly of hydrogen and helium, similar to Jupiter.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>Saturn's atmosphere consists primarily of hydrogen and helium, with traces of ammonia, methane, and water vapor. Its ring system is made up of countless small particles, ranging from micrometers to meters in size.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>Saturn has been visited by several spacecraft, including Pioneer, Voyager, and Cassini. The Cassini spacecraft provided unprecedented detail about Saturn's rings, moons, and atmosphere over a 13-year mission.</p>
        </div>
      </div>
    </div>
  );
};

export default Saturn;
