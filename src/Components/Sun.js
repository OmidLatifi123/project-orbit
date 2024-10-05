import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Stars } from '@react-three/drei';
import Navbar from './Navbar';
import './Styles/Planets.css';

function SunModel() {
  const sunRef = useRef();
  const sunTexture = new THREE.TextureLoader().load('/textures/sun.png');

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    sunRef.current.rotation.y = elapsedTime * 0.05;
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[10, 64, 64]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive={new THREE.Color('#ffb394')}
        emissiveIntensity={1.5}
        emissiveMap={sunTexture}
      />
      <pointLight color="orange" intensity={50} distance={1000} decay={0.5} castShadow />
    </mesh>
  );
}

const Sun = () => {
  return (
    <div className="planet-container">
        <Navbar />
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <Stars 
          radius={300}
          depth={50}
          count={5000}
          factor={7}
          saturation={0.1}
          fade={true}
        />
        <SunModel />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={true} />
      </Canvas>


      <div className="planet-info-overlay">
      <div className="planet-info">
        <div className="info-section">
          <h2>About the Sun</h2>
          <p>The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, radiating energy primarily in the form of light and heat.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>The Sun is composed primarily of hydrogen (about 75% of its mass) and helium (about 25%). It also contains trace amounts of heavier elements like oxygen, carbon, and iron.</p>
        </div>
        <div className="info-section">
          <h2>Solar Activity</h2>
          <p>The Sun experiences a cycle of solar activity, including phenomena such as solar flares, sunspots, and coronal mass ejections, which can affect space weather.</p>
        </div>
      </div>
    </div>
        </div>
  );
};

export default Sun;
