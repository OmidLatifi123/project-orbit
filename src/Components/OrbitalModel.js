import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Text } from '@react-three/drei';
import { Leva, useControls } from 'leva';

// Trajectory class
class SpaceTrajectory {
  constructor(name, smA, oI, aP, oE, aN, mAe, Sidereal) {
    const degToRad = (deg) => (deg * Math.PI) / 180;

    this.name = name;
    this.smA = smA; // Semi-major axis in AU
    this.oI = degToRad(oI); // Inclination in radians
    this.aP = degToRad(aP); // Argument of periapsis in radians
    this.oE = oE; // Eccentricity
    this.aN = degToRad(aN); // Longitude of ascending node in radians
    this.period = Sidereal * 365.25; // Orbital period in days
    this.epochMeanAnomaly = degToRad(mAe); // Mean anomaly at epoch in radians
  }

  propagate(theta) {
    const smA = this.smA;
    const oE = this.oE;
    const oI = this.oI;
    const aP = this.aP;
    const aN = this.aN;

    // Distance from the focal point
    const r = (smA * (1 - oE * oE)) / (1 + oE * Math.cos(theta));

    // Position in orbital plane
    const xOrb = r * Math.cos(theta);
    const yOrb = r * Math.sin(theta);

    // Rotate to 3D space
    const x =
      xOrb * (Math.cos(aN) * Math.cos(aP) - Math.sin(aN) * Math.sin(aP) * Math.cos(oI)) -
      yOrb * (Math.cos(aN) * Math.sin(aP) + Math.sin(aN) * Math.cos(aP) * Math.cos(oI));

    const y =
      xOrb * (Math.sin(aN) * Math.cos(aP) + Math.cos(aN) * Math.sin(aP) * Math.cos(oI)) -
      yOrb * (Math.sin(aN) * Math.sin(aP) - Math.cos(aN) * Math.cos(aP) * Math.cos(oI));

    const z = xOrb * (Math.sin(aP) * Math.sin(oI)) + yOrb * (Math.cos(aP) * Math.sin(oI));

    return [x, y, z];
  }
}

// Kepler's Equation Solver
function meanToEccentricAnomaly(e, M) {
  let E = M;
  let delta = 1;
  const epsilon = 1e-6;
  while (Math.abs(delta) > epsilon) {
    delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E = E - delta;
  }
  return E;
}

function eccentricToTrueAnomaly(e, E) {
  const cosE = Math.cos(E);
  const sinE = Math.sin(E);
  const sqrtOneMinusESquared = Math.sqrt(1 - e * e);
  const sinTheta = (sqrtOneMinusESquared * sinE) / (1 - e * cosE);
  const cosTheta = (cosE - e) / (1 - e * cosE);
  const theta = Math.atan2(sinTheta, cosTheta);
  return theta;
}

// Julian Date to JavaScript Date conversion
function julianToDate(jd) {
  var z = Math.floor(jd + 0.5);
  var f = jd + 0.5 - z;
  var a = z;
  if (z >= 2299161) {
    var alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  var b = a + 1524;
  var c = Math.floor((b - 122.1) / 365.25);
  var d = Math.floor(365.25 * c);
  var e = Math.floor((b - d) / 30.6001);
  var day = b - d - Math.floor(30.6001 * e) + f;
  var month = e < 14 ? e - 1 : e - 13;
  var year = month > 2 ? c - 4716 : c - 4715;

  // Convert fractional day to hours, minutes, seconds
  day = day;
  var hour = (day - Math.floor(day)) * 24;
  var minute = (hour - Math.floor(hour)) * 60;
  var second = (minute - Math.floor(minute)) * 60;

  return new Date(
    Date.UTC(
      year,
      month - 1,
      Math.floor(day),
      Math.floor(hour),
      Math.floor(minute),
      Math.floor(second)
    )
  );
}

// Planet component
function SpacePlanet({
  texture,
  size,
  orbitData,
  spinSpeed,
  simulationSpeed,
  trailColor = 'white',
  dateRef,
}) {
  const planetRef = useRef();
  const orbitTrailRef = useRef({ positions: [], geometry: null });

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    // Adjusted time with simulation speed (t in days)
    const t = elapsedTime * simulationSpeed;

    // Mean motion n (radians per day)
    const n = (2 * Math.PI) / orbitData.period;

    // Mean anomaly M = M0 + n * t
    const M = orbitData.epochMeanAnomaly + n * t;

    // Eccentric anomaly E
    const E = meanToEccentricAnomaly(orbitData.oE, M % (2 * Math.PI));

    // True anomaly theta
    const theta = eccentricToTrueAnomaly(orbitData.oE, E);

    // Get position from trajectory
    const pos = orbitData.propagate(theta);

    // Update planet position and rotation
    planetRef.current.position.set(pos[0], pos[2], pos[1]); // Swapped Y and Z for correct orientation
    planetRef.current.rotation.y += spinSpeed * 0.01; // Adjust rotation increment for smooth spinning

    // Update orbit trail
    if (orbitTrailRef.current.positions.length < 3000) {
      orbitTrailRef.current.positions.push(pos[0], pos[2], pos[1]); // Swapped Y and Z
    } else {
      orbitTrailRef.current.positions.splice(0, 3);
      orbitTrailRef.current.positions.push(pos[0], pos[2], pos[1]); // Swapped Y and Z
    }
    if (orbitTrailRef.current.geometry) {
      orbitTrailRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(orbitTrailRef.current.positions, 3)
      );
      orbitTrailRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update date display (based on Earth's orbit)
    if (dateRef.current && orbitData.name === 'Earth') {
      const currentJulianDate = 2451545.0 + t; // Reference Julian date for J2000 epoch
      const currentDate = julianToDate(currentJulianDate);
      dateRef.current.innerHTML = currentDate.toDateString();
    }
  });

  // Load texture
  const planetTexture = useLoader(THREE.TextureLoader, texture);

  // Create orbit trail geometry and material
  const trailGeometry = useMemo(() => new THREE.BufferGeometry(), []);
  orbitTrailRef.current.geometry = trailGeometry;

  // Reset orbit trail when simulationSpeed changes
  useEffect(() => {
    orbitTrailRef.current.positions = [];
    if (orbitTrailRef.current.geometry) {
      orbitTrailRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute([], 3)
      );
    }
  }, [simulationSpeed]);

  return (
    <>
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial map={planetTexture} />
      </mesh>

      <line>
        <primitive object={trailGeometry} attach="geometry" />
        <lineBasicMaterial color={trailColor} linewidth={2} />
      </line>
    </>
  );
}

// Sun component
function SolarStar({ glow }) {
  const sunTexture = useLoader(THREE.TextureLoader, '/textures/sun.png');
  const sunRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    sunRef.current.rotation.y = elapsedTime * 0.05;
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <meshStandardMaterial
        map={sunTexture}
        emissive={glow ? new THREE.Color(0xffaa00) : null}
        emissiveIntensity={glow ? 1.5 : 0}
        emissiveMap={glow ? sunTexture : null}
      />
    </mesh>
  );
}

// Axis component with labels
function SpaceAxis() {
  const axisLength = 35; 
  const divisions = 7; 

  return (
    <group>
      {/* X-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-axisLength, 0, 0, axisLength, 0, 0])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="red" />
      </line>
      {/* Y-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, -axisLength, 0, 0, axisLength, 0])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="green" />
      </line>
      {/* Z-axis */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([0, 0, -axisLength, 0, 0, axisLength])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="blue" />
      </line>

      {/* Axis labels */}
      {Array.from({ length: divisions * 2 + 1 }, (_, i) => {
        const position = -axisLength + (i * (axisLength * 2)) / (divisions * 2);
        return (
          <group key={`label-${i}`}>
            <Text
              position={[position, 0, 0]}
              color="red"
              fontSize={0.3}
              rotation={[0, 0, 0]}
            >
              {position.toFixed(1)} AU
            </Text>
            <Text
              position={[0, position, 0]}
              color="green"
              fontSize={0.3}
              rotation={[0, 0, 0]}
            >
              {position.toFixed(1)} AU
            </Text>
            <Text
              position={[0, 0, position]}
              color="blue"
              fontSize={0.3}
              rotation={[0, 0, 0]}
            >
              {position.toFixed(1)} AU
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Stars component
function SpaceStars() {
  const starCount = 1000;
  const positions = useMemo(() => {
    const posArray = [];
    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      posArray.push(x, y, z);
    }
    return new Float32Array(posArray);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="white" />
    </points>
  );
}

// Main component that contains the orbital model
export function OrbitalModel() {
  // Simulation speed state
  const [simulationSpeed, setSimulationSpeed] = useState(1); // Default speed: 1 day per second

  // Use Leva for simulation speed control
  const { speed } = useControls('Simulation Controls', {
    speed: {
      value: simulationSpeed,
      min: 0.1,
      max: 100,
      step: 0.1,
      onChange: (value) => setSimulationSpeed(value),
    },
  });

  // Reference to the date display element
  const dateRef = useRef();

  // Orbital parameters for each planet at J2000 epoch
  const mercuryOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Mercury',
        0.387, // Semi-major axis in AU
        7.004, // Inclination in degrees
        29.124, // Argument of periapsis in degrees
        0.2056, // Eccentricity
        48.331, // Longitude of ascending node in degrees
        174.796, // Mean anomaly at epoch in degrees
        0.240846 // Sidereal period in Earth years
      ),
    []
  );

  const venusOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Venus',
        0.723, // Semi-major axis in AU
        3.394, // Inclination in degrees
        54.884, // Argument of periapsis in degrees
        0.0068, // Eccentricity
        76.680, // Longitude of ascending node in degrees
        50.115, // Mean anomaly at epoch in degrees
        0.615 // Sidereal period in Earth years
      ),
    []
  );

  const earthOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Earth',
        1.00000011, // Semi-major axis in AU
        0.00005, // Inclination in degrees
        102.93768193, // Argument of periapsis in degrees
        0.01671022, // Eccentricity
        -11.26064, // Longitude of ascending node in degrees
        8.78752973, // Mean anomaly at epoch in degrees
        1 // Sidereal period in Earth years
      ),
    []
  );

  const marsOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Mars',
        1.523, // Semi-major axis in AU
        1.850, // Inclination in degrees
        286.502, // Argument of periapsis in degrees
        0.0934, // Eccentricity
        49.558, // Longitude of ascending node in degrees
        19.412, // Mean anomaly at epoch in degrees
        1.8808 // Sidereal period in Earth years
      ),
    []
  );

  const jupiterOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Jupiter',
        5.203, // Semi-major axis in AU
        1.304, // Inclination in degrees
        273.867, // Argument of periapsis in degrees
        0.0484, // Eccentricity
        100.464, // Longitude of ascending node in degrees
        20.020, // Mean anomaly at epoch in degrees
        11.862 // Sidereal period in Earth years
      ),
    []
  );

  const saturnOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Saturn',
        9.537, // Semi-major axis in AU
        2.485, // Inclination in degrees
        339.392, // Argument of periapsis in degrees
        0.0541, // Eccentricity
        113.665, // Longitude of ascending node in degrees
        317.020, // Mean anomaly at epoch in degrees
        29.457 // Sidereal period in Earth years
      ),
    []
  );

  const uranusOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Uranus',
        19.191, // Semi-major axis in AU
        0.772, // Inclination in degrees
        96.998, // Argument of periapsis in degrees
        0.0472, // Eccentricity
        74.006, // Longitude of ascending node in degrees
        142.2386, // Mean anomaly at epoch in degrees
        84.07 // Sidereal period in Earth years
      ),
    []
  );

  const neptuneOrbitData = useMemo(
    () =>
      new SpaceTrajectory(
        'Neptune',
        30.069, // Semi-major axis in AU
        1.770, // Inclination in degrees
        273.187, // Argument of periapsis in degrees
        0.0086, // Eccentricity
        131.784, // Longitude of ascending node in degrees
        256.228, // Mean anomaly at epoch in degrees
        164.8 // Sidereal period in Earth years
      ),
    []
  );

  // Update simulation speed from Leva
  useEffect(() => {
    setSimulationSpeed(speed);
  }, [speed]);

  return (
    <>
      <Leva collapsed={false} />
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          color: 'white',
          fontSize: '16px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '5px 10px',
          borderRadius: '5px',
          zIndex: 1,
        }}
        ref={dateRef}
      >
        Date
      </div>
      <Canvas camera={{ position: [0, 10, 30], fov: 60 }} shadows>
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} color="orange" intensity={2} />

        <SolarStar glow={true} />

        {/* Mercury's Orbit */}
        <SpacePlanet
          texture={'/textures/mercury.png'}
          size={0.02}
          orbitData={mercuryOrbitData}
          spinSpeed={0.02} // Adjust spin speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="gray"
          dateRef={dateRef}
        />

        {/* Venus's Orbit */}
        <SpacePlanet
          texture={'/textures/venus.png'}
          size={0.04}
          orbitData={venusOrbitData}
          spinSpeed={0.015} // Adjust spin speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="yellow"
          dateRef={dateRef}
        />

        {/* Earth's Orbit */}
        <SpacePlanet
          texture={'/textures/earth.png'}
          size={0.05}
          orbitData={earthOrbitData}
          spinSpeed={0.05} // Adjust Earth's rotation speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="blue"
          dateRef={dateRef}
        />

        {/* Mars's Orbit */}
        <SpacePlanet
          texture={'/textures/mars.png'}
          size={0.03}
          orbitData={marsOrbitData}
          spinSpeed={0.03} // Adjust spin speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="red"
          dateRef={dateRef}
        />

        {/* Jupiter's Orbit */}
        <SpacePlanet
          texture={'/textures/jupiter.png'}
          size={0.1}
          orbitData={jupiterOrbitData}
          spinSpeed={0.04} // Adjust spin speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="orange"
          dateRef={dateRef}
        />

        {/* Saturn's Orbit */}
        <SpacePlanet
          texture={'/textures/saturn.png'}
          size={0.09}
          orbitData={saturnOrbitData}
          spinSpeed={0.035} // Adjust spin speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="gold"
          dateRef={dateRef}
        />

        {/* Uranus's Orbit */}
        <SpacePlanet
          texture={'/textures/uranus.png'}
          size={0.07}
          orbitData={uranusOrbitData}
          spinSpeed={0.03} // Adjust spin speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="lightblue"
          dateRef={dateRef}
        />

        {/* Neptune's Orbit */}
        <SpacePlanet
          texture={'/textures/neptune.png'}
          size={0.07}
          orbitData={neptuneOrbitData}
          spinSpeed={0.03} // Adjust spin speed as desired
          simulationSpeed={simulationSpeed}
          trailColor="darkblue"
          dateRef={dateRef}
        />

        <SpaceAxis />
        <SpaceStars />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
          }}
          minDistance={5}
          maxDistance={100}
        />
      </Canvas>
    </>
  );
}
