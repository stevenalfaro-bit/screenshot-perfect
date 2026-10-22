import * as THREE from "three";
import { AREAS } from "./events";
import { Rocket } from "./Characters";

export const SEATS: [number, number][] = (() => {
  const out: [number, number][] = [];
  for (const z of [3, 6, 9, 12]) for (let i = 0; i < 8; i++) out.push([AREAS.hangar.x - 9 + i * 2.6, z]);
  return out;
})();

function Floor({ x, size, color, rough = 0.8, metal = 0 }: { x: number; size: number; color: string; rough?: number; metal?: number }) {
  return (
    <mesh position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} />
    </mesh>
  );
}

function Wall({ p, s, color = "#f2efe8" }: { p: [number, number, number]; s: [number, number, number]; color?: string }) {
  return (
    <mesh position={p} castShadow receiveShadow>
      <boxGeometry args={s} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

function House() {
  const x = AREAS.house.x;
  return (
    <group>
      <Floor x={x} size={30} color="#8a6a4f" />
      <Wall p={[x, 3, -15]} s={[30, 6, 0.5]} color="#5b5f66" />
      <Wall p={[x - 15, 3, 0]} s={[0.5, 6, 30]} color="#5b5f66" />
      <Wall p={[x + 15, 3, 0]} s={[0.5, 6, 30]} color="#5b5f66" />
      {/* rug */}
      <mesh position={[x, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[5, 40]} />
        <meshStandardMaterial color="#7d2e2e" roughness={1} />
      </mesh>
      {/* sofa */}
      <Wall p={[x - 6, 0.5, 2]} s={[1.2, 1, 5]} color="#3c3f46" />
      <Wall p={[x - 6.5, 1.2, 2]} s={[0.4, 1.4, 5]} color="#3c3f46" />
      {/* big bookshelf = secret entrance */}
      <Wall p={[x, 2.5, -14.4]} s={[6, 5, 0.8]} color="#4a2e1c" />
      {[0.8, 1.9, 3, 4.1].map((y) => (
        <Wall key={y} p={[x, y, -13.95]} s={[5.6, 0.12, 0.2]} color="#6b4428" />
      ))}
      {/* throne */}
      <Wall p={[x + 10, 0.6, -11]} s={[2, 1.2, 2]} color="#a8322a" />
      <Wall p={[x + 10, 2, -11.9]} s={[2, 3, 0.3]} color="#d4a017" />
      {/* lamp */}
      <pointLight position={[x, 5, 0]} intensity={30} color="#ffd8a8" distance={25} />
    </group>
  );
}

function Lab() {
  const x = AREAS.lab.x;
  return (
    <group>
      <Floor x={x} size={34} color="#5d6673" rough={0.35} metal={0.6} />
      <Wall p={[x, 3, -17]} s={[34, 6, 0.5]} color="#39414d" />
      {[-12, -4, 4, 12].map((dx) => (
        <mesh key={dx} position={[x + dx, 1.5, -8]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 3, 20]} />
          <meshPhysicalMaterial color="#7fe3c2" transmission={0.6} roughness={0.05} emissive="#1f8f6a" emissiveIntensity={0.6} />
        </mesh>
      ))}
      {/* tunnel walls guiding to the rocket door */}
      <Wall p={[x + 3, 1.5, -2]} s={[14, 3, 0.6]} color="#39414d" />
      <Wall p={[x - 4, 1.5, 6]} s={[14, 3, 0.6]} color="#39414d" />
      {/* rocket door */}
      <Wall p={[x + 12, 2, -16.6]} s={[4, 4, 0.3]} color="#d6452f" />
      {/* vault */}
      <mesh position={[x - 14, 2, -16.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.4, 32]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.9} roughness={0.25} />
      </mesh>
      <pointLight position={[x, 5, 0]} intensity={40} color="#a8ffe8" distance={30} />
    </group>
  );
}

function Hangar() {
  const x = AREAS.hangar.x;
  return (
    <group>
      <Floor x={x} size={36} color="#7b8088" rough={0.6} metal={0.3} />
      <Wall p={[x, 0.4, -6]} s={[10, 0.8, 4]} color="#3a3f48" />
      {SEATS.map(([sx, sz]) => (
        <group key={sx + "," + sz} position={[sx, 0, sz]}>
          <Wall p={[0, 0.35, 0]} s={[1.2, 0.2, 1.2]} color="#d6452f" />
          <Wall p={[0, 0.9, 0.55]} s={[1.2, 1, 0.15]} color="#d6452f" />
        </group>
      ))}
      <pointLight position={[x, 8, 0]} intensity={60} distance={40} />
    </group>
  );
}

function Park() {
  const x = AREAS.park.x;
  const trees: [number, number][] = [[-20, -10], [18, -14], [-15, 15], [22, 10], [-24, 5], [10, 22], [-5, -22], [25, -24]];
  return (
    <group>
      <Floor x={x} size={60} color="#5f9e4a" />
      {trees.map(([dx, dz]) => (
        <group key={dx + "," + dz} position={[x + dx, 0, dz]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.35, 2, 10]} />
            <meshStandardMaterial color="#6b4a2f" />
          </mesh>
          <mesh position={[0, 3, 0]} castShadow>
            <icosahedronGeometry args={[1.6, 1]} />
            <meshStandardMaterial color="#3f8a3a" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
      {/* gelato truck */}
      <group position={[x + 10, 0, -20]}>
        <Wall p={[0, 1.5, 0]} s={[5, 2.6, 2.6]} color="#f6a6c8" />
        <Wall p={[0, 3.2, 0]} s={[1, 1, 1]} color="#fff3d6" />
      </group>
      {/* finish line */}
      <mesh position={[x, 0.03, -26]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 2]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Space() {
  const x = AREAS.space.x;
  return (
    <group>
      <mesh position={[x, 0, 0]}>
        <sphereGeometry args={[70, 32, 16]} />
        <meshBasicMaterial color="#070a1c" side={THREE.BackSide} />
      </mesh>
      <mesh position={[x, -0.5, 0]} receiveShadow>
        <cylinderGeometry args={[15, 15, 1, 40]} />
        <meshStandardMaterial color="#c9ced6" metalness={0.6} roughness={0.35} />
      </mesh>
      <Rocket position={[x, 0, 12]} />
      <pointLight position={[x, 10, 5]} intensity={80} distance={60} />
    </group>
  );
}

export function World() {
  return (
    <>
      <House />
      <Lab />
      <Hangar />
      <Park />
      <Space />
    </>
  );
}
