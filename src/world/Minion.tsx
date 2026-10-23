import { forwardRef } from "react";
import * as THREE from "three";
import type { Skin } from "@/live/world";

const SKIN: Record<Skin, { color: string; metal: number; rough: number }> = {
  yellow: { color: "#f7d23e", metal: 0, rough: 0.45 },
  gold: { color: "#f5c542", metal: 0.85, rough: 0.22 },
  purple: { color: "#6d28d9", metal: 0, rough: 0.5 },
};

const denim = new THREE.MeshStandardMaterial({ color: "#2f5fb3", roughness: 0.85 });
const black = new THREE.MeshStandardMaterial({ color: "#1b1b1f", roughness: 0.6 });
const steel = new THREE.MeshStandardMaterial({ color: "#c9ced6", metalness: 0.95, roughness: 0.18 });
const eyeWhite = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 });
const brown = new THREE.MeshStandardMaterial({ color: "#5a3b22", roughness: 0.7 });

export type MinionParts = { body: THREE.Group | null; armL: THREE.Mesh | null; armR: THREE.Mesh | null; legL: THREE.Mesh | null; legR: THREE.Mesh | null };

/** A stylized minion. Origin is at the feet. Pass a parts object to animate limbs. */
export const Minion = forwardRef<THREE.Group, { skin: Skin; parts?: MinionParts; twoEyes?: boolean }>(function Minion({ skin, parts, twoEyes }, ref) {
  const s = SKIN[skin];
  return (
    <group ref={ref}>
      <group ref={(g) => { if (parts) parts.body = g; }}>
        <mesh position={[0, 1.15, 0]} castShadow>
          <capsuleGeometry args={[0.55, 0.75, 8, 20]} />
          <meshStandardMaterial color={s.color} metalness={s.metal} roughness={s.rough} />
        </mesh>
        {/* overalls */}
        <mesh position={[0, 0.82, 0]} castShadow material={denim}>
          <cylinderGeometry args={[0.575, 0.56, 0.62, 20]} />
        </mesh>
        <mesh position={[0, 1.08, -0.5]} material={denim}><boxGeometry args={[0.5, 0.36, 0.1]} /></mesh>
        {/* goggle band */}
        <mesh position={[0, 1.5, 0]} material={black}><cylinderGeometry args={[0.565, 0.565, 0.12, 24, 1, true]} /></mesh>
        {(twoEyes ? [-0.2, 0.2] : [0]).map((x) => (
          <group key={x} position={[x, 1.5, -0.5]} rotation-x={Math.PI / 2}>
            <mesh material={steel}><torusGeometry args={[0.19, 0.06, 10, 24]} /></mesh>
            <mesh position={[0, -0.02, 0]} material={eyeWhite} rotation-x={-Math.PI / 2}><sphereGeometry args={[0.17, 16, 12]} /></mesh>
            <mesh position={[0, -0.15, 0]} rotation-x={-Math.PI / 2}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <meshStandardMaterial color={skin === "purple" ? "#4b0" : "#5b3a1a"} />
            </mesh>
          </group>
        ))}
        {/* mouth */}
        <mesh position={[0, 1.16, -0.53]} rotation-x={Math.PI / 2} material={black}><torusGeometry args={[0.13, 0.025, 6, 16, Math.PI]} /></mesh>
        {/* hair */}
        {[-0.15, 0, 0.15].map((x) => (
          <mesh key={x} position={[x, 1.98, 0]} rotation-z={x * 2} material={black}>
            <cylinderGeometry args={skin === "purple" ? [0.04, 0.02, 0.5, 4] : [0.012, 0.012, 0.25, 3]} />
          </mesh>
        ))}
        <mesh ref={(m) => { if (parts) parts.armL = m; }} position={[-0.62, 1.0, 0]} rotation-z={0.25} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color={s.color} metalness={s.metal} roughness={s.rough} />
        </mesh>
        <mesh ref={(m) => { if (parts) parts.armR = m; }} position={[0.62, 1.0, 0]} rotation-z={-0.25} castShadow>
          <capsuleGeometry args={[0.08, 0.45, 4, 8]} />
          <meshStandardMaterial color={s.color} metalness={s.metal} roughness={s.rough} />
        </mesh>
      </group>
      <mesh ref={(m) => { if (parts) parts.legL = m; }} position={[-0.22, 0.25, 0]} material={denim} castShadow><capsuleGeometry args={[0.12, 0.25, 4, 8]} /></mesh>
      <mesh ref={(m) => { if (parts) parts.legR = m; }} position={[0.22, 0.25, 0]} material={denim} castShadow><capsuleGeometry args={[0.12, 0.25, 4, 8]} /></mesh>
      <mesh position={[-0.22, 0.06, -0.06]} material={brown}><boxGeometry args={[0.24, 0.12, 0.34]} /></mesh>
      <mesh position={[0.22, 0.06, -0.06]} material={brown}><boxGeometry args={[0.24, 0.12, 0.34]} /></mesh>
    </group>
  );
});

/** Swing limbs based on walk phase and pose. */
export function animateMinion(p: MinionParts, phase: number, moving: number, pose: string, t: number) {
  const sw = Math.sin(phase) * 0.7 * moving;
  if (p.legL) p.legL.rotation.x = sw;
  if (p.legR) p.legR.rotation.x = -sw;
  if (p.armL) { p.armL.rotation.x = -sw; p.armL.rotation.z = 0.25; }
  if (p.armR) { p.armR.rotation.x = sw; p.armR.rotation.z = -0.25; }
  if (p.body) { p.body.position.y = Math.abs(Math.sin(phase)) * 0.08 * moving; p.body.rotation.x = 0; p.body.position.z = 0; }
  if (pose === "dance") {
    if (p.armL) p.armL.rotation.z = 2.4 + Math.sin(t * 10) * 0.5;
    if (p.armR) p.armR.rotation.z = -2.4 - Math.sin(t * 10 + 1) * 0.5;
    if (p.body) p.body.position.y = Math.abs(Math.sin(t * 8)) * 0.25;
  } else if (pose === "bow" && p.body) {
    p.body.rotation.x = 0.7;
  } else if (pose === "sit" && p.body) {
    p.body.position.y = -0.35;
    if (p.legL) p.legL.rotation.x = -1.4;
    if (p.legR) p.legR.rotation.x = -1.4;
  } else if (pose === "cheer") {
    if (p.armL) p.armL.rotation.z = 2.8;
    if (p.armR) p.armR.rotation.z = -2.8;
    if (p.body) p.body.position.y = Math.abs(Math.sin(t * 6)) * 0.4;
  }
}
