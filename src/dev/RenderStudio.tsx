import { useEffect, useRef } from 'react'
import { advance, createRoot, extend } from '@react-three/fiber'
import * as THREE from 'three'
import { BrandMesh, GroundGlow, StudioLights } from '../components/three/models'
import type { ShapeName } from '../components/three/shapes'

/**
 * Dev-only page (/__render) that renders the 3D brand assets with a
 * transparent background and saves them as PNGs into public/icons via the
 * dev server (see renderSaver in vite.config.ts). Never in the production build.
 *
 * Usage: open http://localhost:5173/__render?asset=swap, then call
 *   await window.__saveRender('swap')
 * Assets: cross-mark, swap, level, block, shield, sheet, coin.
 *
 * Uses a fixed-size root with a manual frame loop instead of <Canvas>, so it
 * renders even when the browser tab is hidden (no rAF or ResizeObserver).
 */
// <Canvas> registers three's classes itself; a bare createRoot does not.
extend(THREE)

type Asset = { shape: ShapeName; size: number; rotation: [number, number, number] }

const ASSETS: Record<string, Asset> = {
  // The mark faces the viewer, with just enough turn to show its depth.
  'cross-mark': { shape: 'mark', size: 1024, rotation: [-0.06, 0.12, 0] },
  // Icons share one three-quarter pose so they sit together as a set.
  swap: { shape: 'swap', size: 640, rotation: [-0.2, 0.32, 0] },
  level: { shape: 'level', size: 640, rotation: [-0.12, 0.32, 0] }, // flatter, so the bar reads as a line
  block: { shape: 'block', size: 640, rotation: [-0.2, 0.32, 0] },
  shield: { shape: 'shield', size: 640, rotation: [-0.2, 0.32, 0] },
  sheet: { shape: 'sheet', size: 640, rotation: [-0.2, 0.32, 0] },
  // Small and turned further, so the rim shows at ticker size.
  coin: { shape: 'coin', size: 256, rotation: [-0.25, 0.55, 0] },
}

declare global {
  interface Window {
    __saveRender?: (name: string) => Promise<string>
  }
}

export default function RenderStudio() {
  const ref = useRef<HTMLDivElement>(null)
  const name = new URLSearchParams(location.search).get('asset') ?? 'cross-mark'
  const asset = ASSETS[name] ?? ASSETS['cross-mark']

  useEffect(() => {
    const host = ref.current
    if (!host) return
    // A fresh canvas per run: StrictMode mounts twice in dev, and a canvas
    // whose context was lost by the first teardown can't get a new one.
    const canvas = document.createElement('canvas')
    canvas.width = asset.size
    canvas.height = asset.size
    host.appendChild(canvas)

    const root = createRoot(canvas)
    root.configure({
      size: { width: asset.size, height: asset.size, top: 0, left: 0 },
      dpr: 1,
      frameloop: 'never',
      camera: { position: [0, 0, 8], fov: 30 },
      gl: { alpha: true, antialias: true, preserveDrawingBuffer: true },
    })
    root.render(
      <>
        <StudioLights />
        <group rotation={asset.rotation} position={[0, 0.1, 0]}>
          <BrandMesh shape={asset.shape} />
        </group>
        <GroundGlow frames={1} />
      </>,
    )

    window.__saveRender = async (file: string) => {
      // A few frames: environment and contact shadows render on their first.
      for (let i = 0; i < 4; i++) advance(performance.now())
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('toBlob failed')
      const res = await fetch(`/__save-render?name=${encodeURIComponent(file)}`, { method: 'POST', body: blob })
      return `${res.status} ${await res.text()}`
    }

    return () => {
      delete window.__saveRender
      root.unmount()
      canvas.remove()
    }
  }, [asset])

  return (
    <div
      ref={ref}
      style={{ width: asset.size, height: asset.size, background: '#0e0c1a' /* preview on the panel colour; the PNG itself is transparent */ }}
    />
  )
}
