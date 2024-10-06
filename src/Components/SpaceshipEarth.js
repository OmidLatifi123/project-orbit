import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { PerspectiveCamera, useGLTF, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration, DepthOfField } from '@react-three/postprocessing';
import Navbar from './Navbar';
import './Styles/App.css';

function EarthModel({ scale = 3000 }) { 
  const earthRef = useRef();
  const earthTexture = useLoader(THREE.TextureLoader, '/textures/earth.png');

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    earthRef.current.rotation.y = elapsedTime * 0.02;
  });

  return (
    <group scale={scale}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[20, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>
    </group>
  );
}

function SatelliteModel({ modelPath, label, orbitRadius, orbitSpeed, scale = 75, inclination, showLabel }) { 
    const satelliteRef = useRef();
    const { scene } = useGLTF(modelPath);
    
    const [startAngle] = useState(() => Math.random() * Math.PI * 2);

    useFrame(({ clock }) => {
      const elapsedTime = clock.getElapsedTime();
      const angle = elapsedTime * orbitSpeed + startAngle; 
      const x = orbitRadius * Math.cos(angle);
      const z = orbitRadius * Math.sin(angle);
  
      satelliteRef.current.position.set(x, orbitRadius * Math.sin(inclination), z);
      satelliteRef.current.rotation.y = -angle;
    });
  
    return (
      <group ref={satelliteRef}>
        <primitive object={scene} scale={scale} />
        {showLabel && (
          <Text
            position={[10000, 5000, 0]} 
            fontSize={1500} 
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

// Asteroid Component
function Asteroid({ texture, orbitRadius, orbitSpeed, size = 300, name, showLabel }) { 
    const asteroidRef = useRef();
    const asteroidTexture = useLoader(THREE.TextureLoader, texture);
    
    const [startAngle] = useState(() => Math.random() * Math.PI * 2);

    useFrame(({ clock }) => {
      const elapsedTime = clock.getElapsedTime();
      const angle = elapsedTime * orbitSpeed + startAngle;
      const x = orbitRadius * Math.cos(angle);
      const z = orbitRadius * Math.sin(angle);
  
      asteroidRef.current.position.set(x, 0, z);
    });
  
    return (
      <group ref={asteroidRef}>
        <mesh>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={asteroidTexture} />
        </mesh>
        {showLabel && (
          <Text
            position={[0, size + 1000, 0]} 
            fontSize={1000} 
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        )}
      </group>
    );
}

function CockpitModel({ cameraRef }) {
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
      const offset = new THREE.Vector3(0, -1, -0.1);
      offset.applyQuaternion(cameraRef.current.quaternion);
      cockpitRef.current.position.add(offset);
    }
  });

  return <primitive ref={cockpitRef} object={scene} scale={[1, 1, 1]} />;
}

const FreeCamera = ({ cameraRef, isBoosting, setIsBoosting }) => {
  const { camera, gl } = useThree();
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [movement, setMovement] = useState({ forward: 0, backward: 0, left: 0, right: 0, boost: false });

  useEffect(() => {
    const canvas = gl.domElement;
    const handleMouseMove = (event) => {
      if (document.pointerLockElement === canvas) {
        setYaw((prevYaw) => prevYaw - event.movementX * 0.002);
        setPitch((prevPitch) => Math.max(-Math.PI / 2, Math.min(Math.PI / 2, prevPitch - event.movementY * 0.002)));
      }
    };

    const handleMouseDown = () => {
      canvas.requestPointerLock();
    };

    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': setMovement((prev) => ({ ...prev, forward: 1 })); break;
        case 's': setMovement((prev) => ({ ...prev, backward: 1 })); break;
        case 'a': setMovement((prev) => ({ ...prev, right: 1 })); break;
        case 'd': setMovement((prev) => ({ ...prev, left: 1 })); break;
        case ' ': 
          setMovement((prev) => ({ ...prev, boost: true }));
          setIsBoosting(true);
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': setMovement((prev) => ({ ...prev, forward: 0 })); break;
        case 's': setMovement((prev) => ({ ...prev, backward: 0 })); break;
        case 'a': setMovement((prev) => ({ ...prev, right: 0 })); break;
        case 'd': setMovement((prev) => ({ ...prev, left: 0 })); break;
        case ' ': 
          setMovement((prev) => ({ ...prev, boost: false }));
          setIsBoosting(false);
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
  }, [gl, setIsBoosting]);

  useFrame((state, delta) => {
    if (cameraRef.current) {
      cameraRef.current.rotation.order = 'YXZ';
      cameraRef.current.rotation.y = yaw;
      cameraRef.current.rotation.x = pitch;

      const baseSpeed = 100;
      const speed = baseSpeed * (movement.boost ? 100 : 25) * delta;

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

// Moon Component
function MoonModel({ scale = 1000, position = [0, 0, 0] }) {
  const moonRef = useRef();
  const { scene } = useGLTF('/3D-Objects/moon.glb');

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    moonRef.current.rotation.y = elapsedTime * 0.01;
  });

  return (
    <primitive ref={moonRef} object={scene} scale={scale} position={position} />
  );
}

// ICESat Satellite Component
function ICESatModel({ orbitRadius, orbitSpeed, scale = 50, showLabel }) {
  const satelliteRef = useRef();
  const { scene } = useGLTF('/3D-Objects/ICESat.glb');
  const [startAngle] = useState(() => Math.random() * Math.PI * 2);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const angle = elapsedTime * orbitSpeed + startAngle;
    const x = orbitRadius * Math.cos(angle);
    const z = orbitRadius * Math.sin(angle);

    satelliteRef.current.position.set(x, 0, z);
    satelliteRef.current.rotation.y = -angle;
  });

  return (
    <group ref={satelliteRef}>
      <primitive object={scene} scale={scale} />
      {showLabel && (
        <Text
          position={[0, 1000, 0]}
          fontSize={500}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          ICESat
        </Text>
      )}
    </group>
  );
}

// Main SpaceshipEarth Component
function SpaceshipEarth() {
  const cameraRef = useRef();
  const [isBoosting, setIsBoosting] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  return (
    <div className="galaxy-container">
      <Navbar />
      <Canvas shadows className="canvas-background">
        <PerspectiveCamera makeDefault ref={cameraRef} position={[0, 0, 150000]} fov={75} far={1000000} />
        <FreeCamera cameraRef={cameraRef} isBoosting={isBoosting} setIsBoosting={setIsBoosting} />
        <CockpitModel cameraRef={cameraRef} />

        {/* Lighting */}
        <directionalLight 
          position={[100000, 100000, 100000]} 
          intensity={2} 
          color={new THREE.Color(0xfff8e1)}
        />
        <ambientLight intensity={0.3} />
        <pointLight position={[10000, 10000, 10000]} intensity={1.5} />

        <EarthModel />

        {/* Moon and ICESat */}
        <group position={[400000, 0, 0]}>
          <MoonModel scale={900} />
          <ICESatModel
            orbitRadius={21000}
            orbitSpeed={0.02}
            scale={600}
            showLabel={showLabels}
          />
        </group>

        {/* Existing satellites and asteroids */}
        <SatelliteModel
          modelPath="/3D-Objects/Aqua2.glb"
          orbitRadius={65000}
          orbitSpeed={0.015}
          scale={130}
          inclination={10}
          label="Aqua Satellite"
          showLabel={showLabels}
        />

        <SatelliteModel
          modelPath="/3D-Objects/Aura.glb"
          orbitRadius={70000}
          orbitSpeed={0.02}
          scale={120}
          inclination={20}
          label="Aura Satellite"
          showLabel={showLabels}
        />

        <SatelliteModel
          modelPath="/3D-Objects/HubbleSpaceTelescope2.glb"
          orbitRadius={60000}
          orbitSpeed={0.01}
          scale={25}
          inclination={-5}
          label="Hubble Telescope"
          showLabel={showLabels}
        />

        <Asteroid
          texture="/textures/Asteroid.png"
          orbitRadius={120000}
          orbitSpeed={0.01}
          size={300} 
          name="99942 Apophis"
          showLabel={showLabels}
        />

        <Asteroid
          texture="/textures/Asteroid1.png"
          orbitRadius={130000}
          orbitSpeed={0.015}
          size={360}
          name="433 Eros"
          showLabel={showLabels}
        />

        <Asteroid
          texture="/textures/Asteroid1.png"
          orbitRadius={150000}
          orbitSpeed={0.02}
          size={450}
          name="101955 Bennu"
          showLabel={showLabels}
        />

        <Stars radius={300000} depth={1500000} count={10000} factor={15} saturation={0} fade />

        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.85} intensity={1} />
          {isBoosting && (
            <>
              <ChromaticAberration offset={[0.002, 0.002]} />
              <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={2} height={480} />
            </>
          )}
        </EffectComposer>
      </Canvas>

      <div className="overlay-text">
        <h2>Welcome to Spaceship Earth</h2>
        <p>Click to enable mouse look. Use WASD to move. Hold space to boost.</p>
      </div>

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
    </div>
  );
}
  
export default SpaceshipEarth;