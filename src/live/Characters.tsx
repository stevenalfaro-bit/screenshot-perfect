import { forwardRef } from "react";
import * as THREE from "three";

const YELLOW = "#f6d33c";
const DENIM = "#2f5ea8";
const METAL = "#b8bec8";

/** Smooth capsule minion: yellow body, metal goggle, denim overalls, black gloves. */
export const Minion = forwardRef<THREE.Group, { crown?: boolean; tint?: string }>(function Minion({ crown, tint }, ref) {
  return (
    <group ref={ref}>
      {/* body */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <capsuleGeometry args={[0.45, 0.6, 8, 20]} />
        <meshStandardMaterial color={tint ?? YELLOW} roughness={0.45} />
      </mesh>
      {/* overalls */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.47, 0.46, 0.5, 24]} />
        <meshStandardMaterial color={DENIM} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.83, 0.38]} castShadow>
        <boxGeometry args={[0.42, 0.3, 0.12]} />
        <meshStandardMaterial color={DENIM} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.46, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={DENIM} roughness={0.8} />
      </mesh>
      {/* goggle strap + goggle */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.05, 8, 32]} />
        <meshStandardMaterial color="#1b1b1b" />
      </mesh>
      <mesh position={[0, 1.2, 0.43]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.12, 24]} />
        <meshStandardMaterial color={METAL} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0.48]}>
        <sphereGeometry args={[0.15, 16, 12]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0.61]}>
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshStandardMaterial color="#3a2414" />
      </mesh>
      {/* smile */}
      <mesh position={[0, 0.98, 0.42]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.1, 0.02, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#3a1a10" />
      </mesh>
      {/* arms + gloves */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.5, 0.8, 0]} rotation={[0, 0, s * 0.35]}>
          <mesh position={[0, -0.15, 0]}>
            <capsuleGeometry args={[0.07, 0.25, 4, 8]} />
            <meshStandardMaterial color={tint ?? YELLOW} />
          </mesh>
          <mesh position={[0, -0.36, 0]}>
            <sphereGeometry args={[0.1, 12, 8]} />
            <meshStandardMaterial color="#141414" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* shoes */}
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 0.06, 0.06]} castShadow>
          <boxGeometry args={[0.2, 0.12, 0.32]} />
          <meshStandardMaterial color="#141414" />
        </mesh>
      ))}
      {crown && (
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 0.25, 8, 1, true]} />
          <meshStandardMaterial color="#f2b705" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
});

/** Gru: long dark grey coat, striped scarf, big pointy nose. */
export function Gru(props: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={props.position} rotation={[0, props.rotationY ?? 0, 0]} scale={1.15}>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.9, 10]} />
          <meshStandardMaterial color="#2a2a2e" />
        </mesh>
      ))}
      <mesh position={[0, 1.6, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.42, 1.6, 24]} />
        <meshStandardMaterial color="#4a4d55" roughness={0.75} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 2.38 + i * 0.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.38, 0.06, 8, 24]} />
          <meshStandardMaterial color={i % 2 ? "#3b3b3b" : "#8b8f96"} />
        </mesh>
      ))}
      <mesh position={[0, 2.85, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 16]} />
        <meshStandardMaterial color="#e7c3a2" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.82, 0.55]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.45, 12]} />
        <meshStandardMaterial color="#e2b893" roughness={0.6} />
      </mesh>
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, 2.95, 0.36]}>
          <sphereGeometry args={[0.06, 10, 8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.62, 1.8, 0]} rotation={[0, 0, s * 0.5]} castShadow>
          <capsuleGeometry args={[0.11, 0.8, 4, 10]} />
          <meshStandardMaterial color="#4a4d55" />
        </mesh>
      ))}
    </group>
  );
}

export function Rocket(props: { position: [number, number, number] }) {
  return (
    <group position={props.position}>
      <mesh position={[0, 6, 0]} castShadow>
        <cylinderGeometry args={[2, 2.4, 10, 32]} />
        <meshStandardMaterial color="#e8ecf2" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 12.5, 0]} castShadow>
        <coneGeometry args={[2, 3.5, 32]} />
        <meshStandardMaterial color="#d6452f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 8, 2.15]}>
        <circleGeometry args={[0.8, 24]} />
        <meshPhysicalMaterial color="#9fd8ff" transmission={0.5} roughness={0.05} metalness={0.2} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[Math.sin((i * Math.PI * 2) / 3) * 2.4, 1.5, Math.cos((i * Math.PI * 2) / 3) * 2.4]} rotation={[0, (i * Math.PI * 2) / 3, 0]} castShadow>
          <boxGeometry args={[0.3, 3, 1.6]} />
          <meshStandardMaterial color="#d6452f" />
        </mesh>
      ))}
    </group>
  );
}

export function Banana(props: { position: [number, number, number] }) {
  return (
    <group position={props.position} rotation={[0, 0, 0.6]}>
      <mesh castShadow>
        <torusGeometry args={[0.35, 0.1, 8, 16, Math.PI * 0.9]} />
        <meshStandardMaterial color="#ffd83a" emissive="#5a4500" roughness={0.4} />
      </mesh>
    </group>
  );
}
