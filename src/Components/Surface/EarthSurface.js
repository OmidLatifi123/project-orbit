import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { DepthOfField, EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import Navbar from '../Navbar';
import '../Styles/App.css';

import Starfield from './Starfield'; 

function Planet({ texture, size, distanceFromSun, orbitSpeed, spinSpeed, children }) {
  const planetRef = useRef();
  const orbitRef = useRef();
  const planetTexture = useLoader(THREE.TextureLoader, texture);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    planetRef.current.rotation.y = elapsedTime * spinSpeed;
    orbitRef.current.rotation.y = elapsedTime * orbitSpeed;
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={planetRef} position={[distanceFromSun, 0, 0]}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={planetTexture} />
        {children}
      </mesh>
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

function Sun() {
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/sun2.png');
  const sunRef = useRef();

  sunTexture.wrapS = sunTexture.wrapT = THREE.RepeatWrapping;
  sunTexture.repeat.set(1, 1);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    sunRef.current.rotation.y = elapsedTime * 0.05;
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2000, 64, 64]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive={new THREE.Color('#F4E8E5')}
        emissiveIntensity={1.5}
        emissiveMap={sunTexture}
      />
      <pointLight color="#FFFFFF" intensity={20} distance={10000000} decay={0.25} castShadow />
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

function Galaxy() {
  const sunDiameter = 1392700;

  const planetSizes = {
    Mercury: (4879 / sunDiameter) * 50000,
    Venus: (12104 / sunDiameter) * 50000,
    Earth: (12756 / sunDiameter) * 50000,
    Mars: (6792 / sunDiameter) * 50000,
    Jupiter: (142984 / sunDiameter) * 50000,
    Saturn: (120536 / sunDiameter) * 50000,
    Uranus: (51118 / sunDiameter) * 50000,
    Neptune: (49528 / sunDiameter) * 50000,
    Pluto: (2376 / sunDiameter) * 50000,
  };

  const planetDistances = {
    Mercury: 57.9 * 200,
    Venus: 108.2 * 200,
    Earth: 149.6 * 200,
    Mars: 228.0 * 200,
    Jupiter: 778.5 * 200,
    Saturn: 1432.0 * 200,
    Uranus: 2867.0 * 200,
    Neptune: 4515.0 * 200,
    Pluto: 5906.4 * 200,
  };

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

  const planetData = [
    { name: 'Mercury', size: planetSizes.Mercury, distance: planetDistances.Mercury, orbitSpeed: 1 / (orbitalPeriods.Mercury * 5), spinSpeed: 1 / 58.65 },
    { name: 'Venus', size: planetSizes.Venus, distance: planetDistances.Venus, orbitSpeed: 1 / (orbitalPeriods.Venus * 5), spinSpeed: 1 / 243 },
    { name: 'Earth', size: planetSizes.Earth, distance: planetDistances.Earth, orbitSpeed: earthOrbitSpeed, spinSpeed: 1 },
    { name: 'Mars', size: planetSizes.Mars, distance: planetDistances.Mars, orbitSpeed: 1 / (orbitalPeriods.Mars * 5), spinSpeed: 1 / 1.03 },
    { name: 'Jupiter', size: planetSizes.Jupiter, distance: planetDistances.Jupiter, orbitSpeed: 1 / (orbitalPeriods.Jupiter * 5), spinSpeed: 1 / 0.41 },
    { name: 'Saturn', size: planetSizes.Saturn, distance: planetDistances.Saturn, orbitSpeed: 1 / (orbitalPeriods.Saturn * 5), spinSpeed: 1 / 0.45 },
    { name: 'Uranus', size: planetSizes.Uranus, distance: planetDistances.Uranus, orbitSpeed: 1 / (orbitalPeriods.Uranus * 5), spinSpeed: 1 / 0.72 },
    { name: 'Neptune', size: planetSizes.Neptune, distance: planetDistances.Neptune, orbitSpeed: 1 / (orbitalPeriods.Neptune * 5), spinSpeed: 1 / 0.67 },
    { name: 'Pluto', size: planetSizes.Pluto, distance: planetDistances.Pluto, orbitSpeed: 1 / (orbitalPeriods.Pluto * 5), spinSpeed: 1 / 6.39 },
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <Sun />
      {planetData.map((planet) => {
        if (planet.name === 'Earth') {
          return (
            <Planet
              key={planet.name}
              texture={`/textures/${planet.name.toLowerCase()}.png`}
              size={planet.size}
              distanceFromSun={planet.distance}
              orbitSpeed={planet.orbitSpeed}
              spinSpeed={planet.spinSpeed}
            >
              <Moon
                texture="/textures/Moon.png"
                size={0.2727 * planet.size}
                distanceFromPlanet={1000}
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
              distanceFromSun={planet.distance}
              orbitSpeed={planet.orbitSpeed}
              spinSpeed={planet.spinSpeed}
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
            distanceFromSun={planet.distance}
            orbitSpeed={planet.orbitSpeed}
            spinSpeed={planet.spinSpeed}
          />
        );
      })}
    </>
  );
}


const CockpitModel = ({ cameraRef }) => {
  const { scene } = useGLTF('/3D-Objects/cockpit1.glb');
  const cockpitRef = useRef();

  useEffect(() => {
    if (cockpitRef.current) {
      cockpitRef.current.rotation.y = Math.PI;
    }
  }, []);

  useFrame(() => {
    if (cockpitRef.current && cameraRef.current) {
      cockpitRef.current.position.copy(cameraRef.current.position);

      const yRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

      cockpitRef.current.quaternion.copy(cameraRef.current.quaternion).multiply(yRotation);

      const offset = new THREE.Vector3(0, -1, 0.000001); 
      offset.applyQuaternion(cameraRef.current.quaternion);
      cockpitRef.current.position.add(offset);
    }
  });

  return <primitive ref={cockpitRef} object={scene} scale={[1, 1, 1]} />;
};

const FreeCamera = ({ cameraRef, isBoosting }) => {
  const { camera, gl } = useThree();
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [movement, setMovement] = useState({ forward: 0, backward: 0, left: 0, right: 0 });

  useEffect(() => {
    const canvas = gl.domElement;
    const handleMouseMove = (event) => {
      if (document.pointerLockElement === canvas) {
        setYaw((prevYaw) => prevYaw - event.movementX * 0.002);
        setPitch((prevPitch) =>
          Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prevPitch - event.movementY * 0.002))
        );
      }
    };

    const handleMouseDown = () => {
      canvas.requestPointerLock();
    };

    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setMovement((prev) => ({ ...prev, forward: 1 }));
          break;
        case 's':
          setMovement((prev) => ({ ...prev, backward: 1 }));
          break;
        case 'a':
          setMovement((prev) => ({ ...prev, right: 1 }));
          break;
        case 'd':
          setMovement((prev) => ({ ...prev, left: 1 }));
          break;
        case ' ':
          setMovement((prev) => ({ ...prev, boost: true }));
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w':
          setMovement((prev) => ({ ...prev, forward: 0 }));
          break;
        case 's':
          setMovement((prev) => ({ ...prev, backward: 0 }));
          break;
        case 'a':
          setMovement((prev) => ({ ...prev, right: 0 }));
          break;
        case 'd':
          setMovement((prev) => ({ ...prev, left: 0 }));
          break;
        case ' ':
          setMovement((prev) => ({ ...prev, boost: false }));
          break;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (cameraRef.current) {
      cameraRef.current.rotation.order = 'YXZ';
      cameraRef.current.rotation.y = yaw;
      cameraRef.current.rotation.x = pitch;

      const baseSpeed = 300;
      const speed = baseSpeed * (movement.boost ? 50 : 1) * delta;

      const direction = new THREE.Vector3();
      const sideway = new THREE.Vector3();

      cameraRef.current.getWorldDirection(direction);
      sideway.crossVectors(cameraRef.current.up, direction).normalize();

      if (movement.forward) cameraRef.current.position.addScaledVector(direction, speed);
      if (movement.backward) cameraRef.current.position.addScaledVector(direction, -speed);
      if (movement.left) cameraRef.current.position.addScaledVector(sideway, -speed);
      if (movement.right) cameraRef.current.position.addScaledVector(sideway, speed);
    }
  });

  return null;
};

// GalaxyScene Component
function GalaxyScene() {
  const cameraRef = useRef();
  const [isBoosting, setIsBoosting] = useState(false); 

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ') setIsBoosting(true); 
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') setIsBoosting(false); 
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="galaxy-container">
      <Navbar />
      <Canvas className="canvas-background" shadows>
        {/* Set initial camera position further away from the sun */}
        <PerspectiveCamera makeDefault ref={cameraRef} position={[6000, 5000, 10000]} fov={90} far={1000000} />
        <FreeCamera cameraRef={cameraRef} isBoosting={isBoosting} />
        <CockpitModel cameraRef={cameraRef} />
        <Starfield /> 
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1000, 1000, 1000]} />
          <meshBasicMaterial color="#F4E8E5" />
        </mesh>
        <Galaxy />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.85} intensity={1.2} />
          {isBoosting && (
            <>
              <ChromaticAberration offset={[0.001, 0.001]} />
              <DepthOfField focusDistance={30} focalLength={0.001} bokehScale={1} height={480} />
            </>
          )}
        </EffectComposer>
      </Canvas>

      <div className="overlay-text">
        <h2>Welcome to Project Orbit</h2>
        <p>Click to enable mouse look. Use WASD to move. Hold space to boost.</p>
      </div>
    </div>
  );
}

export default GalaxyScene;
