import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const Starfield = () => {
  const starRef = useRef();

  const [positions, colors] = useMemo(() => {
    const positions = [];
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < 1000; i++) {
      positions.push(
        THREE.MathUtils.randFloatSpread(2000000),
        THREE.MathUtils.randFloatSpread(2000000),
        THREE.MathUtils.randFloatSpread(2000000)
      );

      color.setHSL(Math.random(), 0.7, 0.7);
      colors.push(color.r, color.g, color.b);
    }

    return [new Float32Array(positions), new Float32Array(colors)];
  }, []);

  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.x += 0.0001;
      starRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={starRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={5}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        alphaTest={0.5}
        opacity={1.0}
      />
    </points>
  );
};

export default Starfield;