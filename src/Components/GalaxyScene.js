// GalaxyScene.js
import React, { useRef, useState, useEffect } from 'react'; // Added useEffect here
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'; // Added useThree here
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Navbar from './Navbar';

import './Styles/App.css';

function OrbitPath({ radius, color, angle }) {
  const orbitRef = useRef();

  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    points.push(new THREE.Vector3(x, Math.sin(angle) * z, Math.cos(angle) * z));
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line ref={orbitRef}>
      <bufferGeometry attach="geometry" {...orbitGeometry} />
      <lineBasicMaterial attach="material" color={color} linewidth={1} />
    </line>
  );
}

function Planet({ texture, size, distanceFromSun, orbitSpeed, spinSpeed, realSpinSpeed, useRealSpinSpeed, children, showTrajectory, orbitAngle, orbitColor }) {
  const planetRef = useRef();
  const orbitRef = useRef();
  const planetTexture = useLoader(THREE.TextureLoader, texture);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    planetRef.current.rotation.y = elapsedTime * (useRealSpinSpeed ? realSpinSpeed : spinSpeed);
    orbitRef.current.rotation.y = elapsedTime * orbitSpeed;
  });

  return (
    <group ref={orbitRef} rotation={[0, 0, orbitAngle]}>
      <mesh ref={planetRef} position={[distanceFromSun, 0, 0]}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={planetTexture} />
        {children}
      </mesh>
      {showTrajectory && <OrbitPath radius={distanceFromSun} color={orbitColor} angle={orbitAngle} />}
    </group>
  );
}

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
      <group rotation={[0.0873, 0, 0]}>
        <mesh ref={moonRef} position={[distanceFromPlanet, 0, 0]} castShadow receiveShadow>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={moonTexture} />
        </mesh>
      </group>
    </group>
  );
}

function Sun({ glow }) {
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/sun.png');
  const sunRef = useRef();

  sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
  sunTexture.repeat.set(1, 1);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    sunRef.current.rotation.y = elapsedTime * 0.05; 
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]} scale={[1, 1, 1]}> 
      <sphereGeometry args={[10, 64, 64]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive={new THREE.Color('#ffb394')}  
        emissiveIntensity={glow ? 1.5 : 0}
        emissiveMap={sunTexture}
      />
      <pointLight
        color={new THREE.Color('#ffeb8a')} 
        intensity={50}
        distance={1000}
        decay={0.6}
        position={[0, 0, 0]} 
        castShadow
      />
    </mesh>
  );
}

function SaturnRings({ size }) {
  const ringTexture = useLoader(THREE.TextureLoader, '/textures/saturnRing.png');
  const ringsRef = useRef();

  useFrame(() => {
    ringsRef.current.rotation.x = Math.PI / 2;
  });

  const innerRadius = size * 1.2;
  const outerRadius = size * 2;

  return (
    <mesh ref={ringsRef} castShadow receiveShadow>
      <ringGeometry args={[innerRadius, outerRadius, 64]} />
      <meshBasicMaterial map={ringTexture} side={THREE.DoubleSide} transparent={true} opacity={0.8} />
    </mesh>
  );
}

function Galaxy({ realSize, realDistance, showTrajectory, realisticSpeed, useRealSpinSpeed, visible }) {
  const distanceMultiplier = realDistance ? 1 : 0.75;

  const baseDistance = 60;

  const sunDiameter = 1392700;

  const planetSizes = {
    Mercury: 4879 / sunDiameter,
    Venus: 12104 / sunDiameter,
    Earth: 12756 / sunDiameter,
    Mars: 6792 / sunDiameter,
    Jupiter: 142984 / sunDiameter,
    Saturn: 120536 / sunDiameter,
    Uranus: 51118 / sunDiameter,
    Neptune: 49528 / sunDiameter,
    Pluto: 2376 / sunDiameter,
  };

  const defaultSizeMultiplier = 2;

  const earthOrbitSpeed = 1 / 5;

  const orbitalPeriods = {
    Mercury: 0.24,
    Venus: 0.61,
    Earth: 1,
    Mars: 1.88,
    Jupiter: 11.86,
    Saturn: 29.46,
    Uranus: 84.01,
    Neptune: 164.8,
    Pluto: 248,
  };

  const realSpinSpeeds = {
    Mercury: 1 / (1407.6 / 24),  
    Venus: -1 / (5832.5 / 24),   
    Earth: 1,
    Mars: 1 / (24.6 / 24),
    Jupiter: 1 / (9.9 / 24),
    Saturn: 1 / (10.7 / 24),
    Uranus: -1 / (17.2 / 24),    
    Neptune: 1 / (16.1 / 24),
    Pluto: -1 / (153.3 / 24),    
  };

  const orbitSpeedMultiplier = realisticSpeed ? 1 : 0.5;

  const planetData = [
    { name: 'Mercury', size: realSize ? planetSizes.Mercury : defaultSizeMultiplier, distance: realDistance ? 57.9 : baseDistance, orbitSpeed: 1 / (orbitalPeriods.Mercury * 5), spinSpeed: 1 / 58.65, realSpinSpeed: realSpinSpeeds.Mercury, orbitAngle: 7 * Math.PI / 180 },
    { name: 'Venus', size: realSize ? planetSizes.Venus : defaultSizeMultiplier * 1.5, distance: realDistance ? 108.2 : baseDistance * 1.5, orbitSpeed: 1 / (orbitalPeriods.Venus * 5), spinSpeed: 1 / 243, realSpinSpeed: realSpinSpeeds.Venus, orbitAngle: 3.4 * Math.PI / 180 },
    { name: 'Earth', size: realSize ? planetSizes.Earth : defaultSizeMultiplier * 2, distance: realDistance ? 149.6 : baseDistance * 2, orbitSpeed: earthOrbitSpeed, spinSpeed: 1, realSpinSpeed: realSpinSpeeds.Earth, orbitAngle: 0 },
    { name: 'Mars', size: realSize ? planetSizes.Mars : defaultSizeMultiplier * 1.2, distance: realDistance ? 228.0 : baseDistance * 2.5, orbitSpeed: 1 / (orbitalPeriods.Mars * 5), spinSpeed: 1 / 1.03, realSpinSpeed: realSpinSpeeds.Mars, orbitAngle: 1.9 * Math.PI / 180 },
    { name: 'Jupiter', size: realSize ? planetSizes.Jupiter : defaultSizeMultiplier * 3, distance: realDistance ? 778.5 : baseDistance * 3.5, orbitSpeed: 1 / (orbitalPeriods.Jupiter * 5), spinSpeed: 1 / 0.41, realSpinSpeed: realSpinSpeeds.Jupiter, orbitAngle: 1.3 * Math.PI / 180 },
    { name: 'Saturn', size: realSize ? planetSizes.Saturn : defaultSizeMultiplier * 2.7, distance: realDistance ? 1432.0 : baseDistance * 4.5, orbitSpeed: 1 / (orbitalPeriods.Saturn * 5), spinSpeed: 1 / 0.45, realSpinSpeed: realSpinSpeeds.Saturn, orbitAngle: 2.5 * Math.PI / 180 },
    { name: 'Uranus', size: realSize ? planetSizes.Uranus : defaultSizeMultiplier * 2.2, distance: realDistance ? 2867.0 : baseDistance * 5.5, orbitSpeed: 1 / (orbitalPeriods.Uranus * 5), spinSpeed: 1 / 0.72, realSpinSpeed: realSpinSpeeds.Uranus, orbitAngle: 0.8 * Math.PI / 180 },
    { name: 'Neptune', size: realSize ? planetSizes.Neptune : defaultSizeMultiplier * 3.88, distance: realDistance ? 4515.0 : baseDistance * 6.0, orbitSpeed: 1 / (orbitalPeriods.Neptune * 5), spinSpeed: 1 / 0.67, realSpinSpeed: realSpinSpeeds.Neptune, orbitAngle: 1.8 * Math.PI / 180 },
    { name: 'Pluto', size: realSize ? planetSizes.Pluto : defaultSizeMultiplier * 0.5, distance: realDistance ? 5906.4 : baseDistance * 7.5, orbitSpeed: 1 / (orbitalPeriods.Pluto * 5), spinSpeed: 1 / 6.39, realSpinSpeed: realSpinSpeeds.Pluto, orbitAngle: 17 * Math.PI / 180 },
  ];

  const planetColors = {
    Mercury: '#8c7853',
    Venus: '#ffd700',
    Earth: '#4169e1',
    Mars: '#b22222',
    Jupiter: '#ffa500',
    Saturn: '#f4a460',
    Uranus: '#40e0d0',
    Neptune: '#4682b4',
    Pluto: '#deb887',
  };

  return (
    <>
      {visible && planetData.map((planet) => {
  if (planet.name === 'Earth') {
    return (
      <Planet
        key={planet.name}
        texture={`/textures/${planet.name.toLowerCase()}.png`}
        size={planet.size}
        distanceFromSun={planet.distance * distanceMultiplier}
        orbitSpeed={planet.orbitSpeed * orbitSpeedMultiplier}
        spinSpeed={planet.spinSpeed}
        realSpinSpeed={realSpinSpeeds[planet.name]}  
        useRealSpinSpeed={useRealSpinSpeed}
        showTrajectory={showTrajectory}
        orbitAngle={planet.orbitAngle}
        orbitColor={planetColors[planet.name]}
      >
        <Moon
          texture="/textures/moon.png"
          size={realSize ? 0.2727 * planet.size : 0.27 * defaultSizeMultiplier}
          distanceFromPlanet={realSize ? 5 : 6}
          orbitSpeed={1 / 136.61}
          spinSpeed={0.1}
        />
      </Planet>
    );
  } else if (planet.name === 'Saturn') {
    return (
      <Planet
        key={planet.name}
        texture={`/textures/${planet.name.toLowerCase()}.png`}
        size={planet.size}
        distanceFromSun={planet.distance * distanceMultiplier}
        orbitSpeed={planet.orbitSpeed * orbitSpeedMultiplier}
        spinSpeed={planet.spinSpeed}
        realSpinSpeed={realSpinSpeeds[planet.name]}  
        useRealSpinSpeed={useRealSpinSpeed}
        showTrajectory={showTrajectory}
        orbitAngle={planet.orbitAngle}
        orbitColor={planetColors[planet.name]}
      >
        <SaturnRings size={planet.size} />
      </Planet>
    );
  }
  return (
    <Planet
      key={planet.name}
      texture={`/textures/${planet.name.toLowerCase()}.png`}
      size={planet.size}
      distanceFromSun={planet.distance * distanceMultiplier}
      orbitSpeed={planet.orbitSpeed * orbitSpeedMultiplier}
      spinSpeed={planet.spinSpeed}
      realSpinSpeed={realSpinSpeeds[planet.name]} 
      useRealSpinSpeed={useRealSpinSpeed}
      showTrajectory={showTrajectory}
      orbitAngle={planet.orbitAngle}
      orbitColor={planetColors[planet.name]}
    />
  );
})}
    </>
  );
}

function MilkyWay({ visible, zoomOffset }) {
  const texture = useLoader(THREE.TextureLoader, '/textures/milkyway.png');
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0001;
      meshRef.current.position.set(400, -100000, 200);
    }
  });

  return (
    <mesh ref={meshRef} visible={visible}>
      <planeGeometry args={[500000, 500000]} /> 
      <meshBasicMaterial map={texture} transparent opacity={visible ? 1 : 0} side={THREE.DoubleSide} /> 
    </mesh>
  );
}

function TransitionStars({ visible }) {
  return (
    <Stars
      radius={1000000}  
      depth={100000}    
      count={10000}     
      factor={8}       
      saturation={0.5}
      fade={true}
      speed={0.2}      
      visible={visible}
    />
  );
}

function CameraControls({ solarSystemMaxDistance, milkyWayDistance, setInMilkyWay, setZoomOffset }) {
  const { camera } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.addEventListener('change', handleControlsChange);
    }
    return () => {
      if (controlsRef.current) {
        controlsRef.current.removeEventListener('change', handleControlsChange);
      }
    };
  }, []);

  const handleControlsChange = () => {
    const distance = camera.position.length();
    if (distance > milkyWayDistance) {
      setInMilkyWay(true);
      setZoomOffset({ x: 400, y: 400 });
    } else {
      setInMilkyWay(false);
      setZoomOffset({ x: 0, y: 0 });
    }
  };

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      minDistance={50}
      maxDistance={milkyWayDistance + 500000}  
    />
  );
}

// Main Galaxy Scene Component
function GalaxyScene() {
  const [realSize, setRealSize] = useState(false);
  const [realDistance, setRealDistance] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [realisticSpeed, setRealisticSpeed] = useState(false);
  const [useRealSpinSpeed, setUseRealSpinSpeed] = useState(false);
  const [inMilkyWay, setInMilkyWay] = useState(false);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });

  const solarSystemMaxDistance = 2000;
  const milkyWayDistance = 50000; 

  return (
    <div className="galaxy-container">
      <Navbar />
      <Canvas 
        className="canvas-background" 
        camera={{ 
          position: [0, 150, 300], 
          fov: 40,
          near: 0.1,
          far: 1000000  
        }} 
        shadows
      >
        <ambientLight intensity={0.5} /> 
        <Sun glow={true} />  
        <Galaxy 
          realSize={realSize} 
          realDistance={realDistance} 
          showTrajectory={showTrajectory} 
          realisticSpeed={realisticSpeed}
          useRealSpinSpeed={useRealSpinSpeed}
          visible={!inMilkyWay}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.85} intensity={5} />
        </EffectComposer>
        <TransitionStars visible={true} />
        <MilkyWay visible={inMilkyWay} zoomOffset={zoomOffset} /> 
        <CameraControls 
          solarSystemMaxDistance={solarSystemMaxDistance} 
          milkyWayDistance={milkyWayDistance} 
          setInMilkyWay={setInMilkyWay} 
          setZoomOffset={setZoomOffset} 
        />
      </Canvas>

      <div className="overlay-text">
        <h2>Welcome to Project Orbit</h2>
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
            id="realistic-speed"
            checked={realisticSpeed}
            onChange={(e) => setRealisticSpeed(e.target.checked)}
          />
          <label htmlFor="realistic-speed">Realistic Orbit Speed</label>
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
        <div className="switch-group">
          <input
            type="checkbox"
            id="real-spin-speed"
            checked={useRealSpinSpeed}
            onChange={(e) => setUseRealSpinSpeed(e.target.checked)}
          />
          <label htmlFor="real-spin-speed">Real Spin Speed</label>
        </div>
      </div>
    </div>
  );
}

export default GalaxyScene;