import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; 
import { OrbitControls, Stars, Text } from '@react-three/drei'; 
import Navbar from './Navbar';
import './Styles/Planets.css'; 

function MoonModel({ showLabel }) {
  const moonRef = useRef();


  const moonModel = useLoader(GLTFLoader, '/3D-Objects/moon.glb');


  const moonTexture = useLoader(THREE.TextureLoader, '/textures/moon.png');


  moonModel.scene.traverse((child) => {
    if (child.isMesh) {

      moonTexture.wrapS = THREE.RepeatWrapping;
      moonTexture.wrapT = THREE.RepeatWrapping;
      moonTexture.repeat.set(1, 1);
      child.material = new THREE.MeshStandardMaterial({
        map: moonTexture,
        roughness: 1,
        metalness: 0, 
        emissive: new THREE.Color(0x000000), 
      });
    }
  });


  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    moonRef.current.rotation.y = elapsedTime * 0.05; 
  });

  return (
    <group ref={moonRef} position={[0, 0, 0]}>
      <primitive object={moonModel.scene} scale={[1.5, 1.5, 1.5]} /> 
      {showLabel && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.75} 
          color="white" 
          anchorX="center"
          anchorY="middle"
        >
          Moon
        </Text>
      )}
    </group>
  );
}

function SatelliteModel({ modelPath, orbitRadius, orbitSpeed, scale, showLabel, label }) {
  const satelliteRef = useRef();
  const satelliteModel = useLoader(GLTFLoader, modelPath);

  // Orbit the satellite around the moon
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const x = orbitRadius * Math.cos(elapsedTime * orbitSpeed);
    const z = orbitRadius * Math.sin(elapsedTime * orbitSpeed);
    satelliteRef.current.position.set(x, 0, z);
  });

  return (
    <group ref={satelliteRef}>
      <primitive object={satelliteModel.scene} scale={[scale, scale, scale]} />
      {showLabel && (
        <Text
          position={[0, 1.5, 0]} 
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

const Moon = () => {
  const [showLabels, setShowLabels] = useState(false); 

  return (
    <div className="planet-container">
      <Navbar />
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>

        <ambientLight intensity={0.25} />

  
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.2} 
          castShadow
        />

   
        <Stars 
          radius={300}        
          depth={50}        
          count={5000}       
          factor={7}          
          saturation={0.1}    
          fade={true}         
        />

       
        <MoonModel showLabel={showLabels} />

      
        <SatelliteModel
          modelPath="/3D-Objects/ICESat.glb"
          orbitRadius={23}
          orbitSpeed={0.4}
          scale={3}
          showLabel={showLabels}
          label="ICESat (Ice, Cloud, and land Elevation Satellite)"
        />

      
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}  
          enableRotate={true} 
          minDistance={40}    
          maxDistance={50}    
          maxPolarAngle={Math.PI / 2} 
        />
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

      
      <div className="planet-info-overlay">
      <div className="planet-info">
        <div className="info-section">
          <h2>About the Moon</h2>
          <p>The Moon is Earth's only natural satellite and is the fifth-largest satellite in the Solar System. It is the second-densest satellite, after Io, a satellite of Jupiter.</p>
        </div>
        <div className="info-section">
          <h2>Composition</h2>
          <p>The Moon is primarily composed of silicate rock and metal, with a crust, mantle, and core. Its surface is covered with impact craters and vast basaltic plains called maria.</p>
        </div>
        <div className="info-section">
          <h2>Exploration</h2>
          <p>The Moon has been explored by numerous missions, including NASA's Apollo program, which saw humans land on the Moon for the first time in 1969. Recent missions have continued to study its composition and geology.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Moon;
