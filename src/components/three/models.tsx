import { useMemo } from 'react'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { SHAPES, type ShapeName } from './shapes'

/** Largest dimension of every object, in world units, so they match in scale. */
const FIT = 2.7

/**
 * Per-shape bevel. The mark's outward bevel stays small so its three pieces
 * keep their gaps; the round profile comes from bevel thickness. Icons have
 * wider gaps and can take a fuller bevel.
 */
const BEVEL: Record<ShapeName, { size: number; thickness: number }> = {
  mark: { size: 9, thickness: 46 },
  swap: { size: 16, thickness: 44 },
  level: { size: 16, thickness: 46 },
  block: { size: 16, thickness: 44 },
  shield: { size: 14, thickness: 44 },
  sheet: { size: 12, thickness: 40 },
  coin: { size: 10, thickness: 40 },
}

const cache = new Map<ShapeName, THREE.BufferGeometry>()

/** Extrude an outline, bevel it, centre it and fit it. */
function buildGeometry(name: ShapeName) {
  const cached = cache.get(name)
  if (cached) return cached

  const { paths } = new SVGLoader().parse(SHAPES[name])
  const shapes = paths.flatMap((p) => SVGLoader.createShapes(p))
  const bevel = BEVEL[name]
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: 110,
    bevelEnabled: true,
    bevelThickness: bevel.thickness,
    bevelSize: bevel.size,
    bevelSegments: 20,
    curveSegments: 48,
  })
  geometry.center()
  geometry.computeBoundingBox()
  const size = new THREE.Vector3()
  geometry.boundingBox!.getSize(size)
  const s = FIT / Math.max(size.x, size.y)
  // SVG y runs down; flip it. Flipping z too keeps the face winding correct.
  geometry.scale(s, -s, -s)
  // Normals: the extrusion's own. With 20 bevel segments the edge reads round,
  // and the flat faces stay clean (re-smoothing streaks them).
  cache.set(name, geometry)
  return geometry
}

/**
 * Soft matte frosted violet, tuned for the dark theme: brighter faces than on
 * a light page, and a faint inner glow so the shadow side never sinks into
 * the background. Clay-like, a little sheen, a hint of light through it.
 */
export function SoftVioletMaterial() {
  return (
    <meshPhysicalMaterial
      color="#A585FF"
      emissive="#2A1166"
      emissiveIntensity={0.35}
      roughness={0.48}
      metalness={0}
      clearcoat={0.35}
      clearcoatRoughness={0.55}
      sheen={1}
      sheenRoughness={0.5}
      sheenColor="#E3D8FF"
      transmission={0.08}
      thickness={1.2}
      ior={1.35}
      attenuationColor="#7838F0"
      attenuationDistance={2.5}
    />
  )
}

export function BrandMesh({ shape }: { shape: ShapeName }) {
  const geometry = useMemo(() => buildGeometry(shape), [shape])
  return (
    <mesh geometry={geometry} castShadow>
      <SoftVioletMaterial />
    </mesh>
  )
}

/**
 * Studio lighting for a dark page, built from local light panels (no HDR
 * download): a soft key from the upper left, a cool fill, and two rim lights
 * from behind so the bevelled edges read against near-black.
 */
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 5, 5]} intensity={1.0} />
      {/* Rim: behind and above, either side. */}
      <directionalLight position={[4, 3, -5]} intensity={2.4} color="#D4C6FF" />
      <directionalLight position={[-5, 1, -4]} intensity={1.5} color="#B9A3FF" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[-4, 4, 5]} scale={[7, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.0} color="#E4DAFF" position={[4, 1, 3]} scale={[4, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} color="#D9CCFF" position={[3.5, 2, -4]} scale={[1.2, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#C4B0FF" position={[-3.5, 1, -4]} scale={[1.2, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={0.6} color="#B79CFF" position={[0, -5, 2]} scale={4} target={[0, 0, 0]} />
      </Environment>
    </>
  )
}

/**
 * Under the object: a faint violet glow rather than a dark shadow, so it
 * reads on the near-black panels. `frames={1}` for one-off renders.
 */
export function GroundGlow({ frames }: { frames?: number }) {
  return <ContactShadows position={[0, -1.65, 0]} opacity={0.55} scale={8} blur={3.2} far={3} color="#8B5CFF" frames={frames} />
}
