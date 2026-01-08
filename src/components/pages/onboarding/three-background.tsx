"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const colors = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#6366f1", // indigo
];

function AnimatedSparkles() {
  const ref = useRef<THREE.Points>(null);

  const { positions, pointColors } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread sparkles across the viewport
      positions[i3] = (Math.random() - 0.5) * 30;
      positions[i3 + 1] = (Math.random() - 0.5) * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 15;

      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      colorArray[i3] = color.r;
      colorArray[i3 + 1] = color.g;
      colorArray[i3 + 2] = color.b;
    }

    return { positions, pointColors: colorArray };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Gentle rotation
      ref.current.rotation.x += delta * 0.03;
      ref.current.rotation.y += delta * 0.05;

      // Make sparkles twinkle by animating opacity
      const material = ref.current.material as THREE.PointsMaterial;
      material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={pointColors as Float32Array} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <AnimatedSparkles />
      </Canvas>
    </div>
  );
}
