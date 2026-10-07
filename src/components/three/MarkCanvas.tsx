import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { BrandMesh, GroundGlow, StudioLights } from './models'

/** Max tilt in any direction: ~20°. */
const MAX_TILT = MathUtils.degToRad(20)

/**
 * Cursor position measured from the centre of this canvas, scaled to the
 * window and clamped to -1..1 (y up), so the mark turns toward the cursor
 * wherever it is on the page, and faces you when you point at it.
 *
 * (R3F's own `state.pointer` with eventPrefix="client" divides window
 * coordinates by the canvas size without subtracting the canvas position, so
 * anywhere over the hero it read as off-scale and pinned the tilt at 20°.)
 */
function useCursorFromCanvas() {
  const { gl } = useThree()
  const cursor = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect()
      cursor.current.x = MathUtils.clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1)
      cursor.current.y = MathUtils.clamp(-(e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2), -1, 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [gl])
  return cursor
}

/** Calls onReady once, on the first rendered frame. */
function useReadyOnce(onReady?: () => void) {
  const ready = useRef(false)
  return () => {
    if (ready.current) return
    ready.current = true
    onReady?.()
  }
}

/**
 * Desktop (a pointer that can hover). Rest pose faces the viewer so the logo
 * always reads. On top of that: a slow float, a whisper of drift, and an
 * eased tilt toward the pointer, clamped.
 */
function CursorMark({ onReady }: { onReady?: () => void }) {
  const group = useRef<Group>(null)
  const markReady = useReadyOnce(onReady)
  const cursor = useCursorFromCanvas()
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    markReady()
    const t = state.clock.elapsedTime
    const targetY = MathUtils.clamp(cursor.current.x * 0.3 + Math.sin(t * 0.3) * 0.05, -MAX_TILT, MAX_TILT)
    const targetX = MathUtils.clamp(-cursor.current.y * 0.25 + Math.sin(t * 0.45) * 0.03, -MAX_TILT, MAX_TILT)
    const ease = 1 - Math.exp(-delta * 2.5)
    g.rotation.y += (targetY - g.rotation.y) * ease
    g.rotation.x += (targetX - g.rotation.x) * ease
    g.position.y = 0.1 + Math.sin(t * 0.8) * 0.06
  })
  return (
    <group ref={group}>
      <BrandMesh shape="mark" />
    </group>
  )
}

/** Radians of turn per pixel dragged, and how far a drag may turn the mark. */
const DRAG_TURN = 0.009
const DRAG_TILT = 0.006
const MAX_DRAG_TURN = MathUtils.degToRad(60)
const MAX_DRAG_TILT = MathUtils.degToRad(30)

/**
 * Touch drag on the canvas. The canvas wrapper uses `touch-action: pan-y`, so
 * the browser keeps vertical swipes as page scrolls (and sends pointercancel);
 * only horizontal or clearly diagonal drags arrive here and turn the mark.
 */
function useTouchDrag() {
  const { gl } = useThree()
  const drag = useRef({ id: -1, startX: 0, startY: 0, turn: 0, tilt: 0 })
  useEffect(() => {
    const el = gl.domElement
    const d = drag.current
    const release = (e: PointerEvent) => {
      if (e.pointerId !== d.id) return
      d.id = -1
      d.turn = 0
      d.tilt = 0
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || d.id !== -1) return
      d.id = e.pointerId
      d.startX = e.clientX
      d.startY = e.clientY
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== d.id) return
      d.turn = MathUtils.clamp((e.clientX - d.startX) * DRAG_TURN, -MAX_DRAG_TURN, MAX_DRAG_TURN)
      d.tilt = MathUtils.clamp((e.clientY - d.startY) * DRAG_TILT, -MAX_DRAG_TILT, MAX_DRAG_TILT)
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', release)
    el.addEventListener('pointercancel', release)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', release)
      el.removeEventListener('pointercancel', release)
    }
  }, [gl])
  return drag
}

/**
 * Phones and tablets (touch, no hover). Always alive: a gentle float and a
 * slow tilt loop around the front-facing rest pose. A drag turns the mark
 * under the finger; on release a soft spring brings it back to the front,
 * with a small overshoot.
 */
function TouchMark({ onReady }: { onReady?: () => void }) {
  const group = useRef<Group>(null)
  const markReady = useReadyOnce(onReady)
  const drag = useTouchDrag()
  const velocity = useRef({ x: 0, y: 0 })
  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    markReady()
    const t = state.clock.elapsedTime
    const dt = Math.min(delta, 1 / 30) // keep the spring stable after a dropped frame
    const dragging = drag.current.id !== -1
    // Idle loop: slow, slight, never far from facing the viewer.
    const idleY = Math.sin(t * 0.5) * 0.14
    const idleX = Math.sin(t * 0.7) * 0.06
    const targetY = dragging ? drag.current.turn : idleY
    const targetX = dragging ? drag.current.tilt : idleX
    // Stiff and well damped while held (tracks the finger), softer once let go (springs back).
    const stiffness = dragging ? 260 : 70
    const damping = dragging ? 30 : 9
    const v = velocity.current
    v.y += ((targetY - g.rotation.y) * stiffness - v.y * damping) * dt
    v.x += ((targetX - g.rotation.x) * stiffness - v.x * damping) * dt
    g.rotation.y += v.y * dt
    g.rotation.x += v.x * dt
    g.position.y = 0.1 + Math.sin(t * 0.8) * 0.06
  })
  return (
    <group ref={group}>
      <BrandMesh shape="mark" />
    </group>
  )
}

type MarkCanvasProps = {
  /** Render frames only while visible on screen. */
  active?: boolean
  /** First frame drawn: safe to hide the static stand-in. */
  onReady?: () => void
  onFail?: () => void
}

/** True for touch-first devices (no hover): phones and most tablets. */
const isTouchFirst = () => typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches

/** Live 3D mark. Lazy-loaded by LiveMark; never more than one animating at once. */
export default function MarkCanvas({ active = true, onReady, onFail }: MarkCanvasProps) {
  const [touch] = useState(isTouchFirst)
  return (
    <Canvas
      dpr={[1, 2]} // pixel ratio capped at 2
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 30 }}
      gl={{ alpha: true, antialias: true }}
      // Vertical swipes stay page scrolls; sideways drags reach the mark.
      style={touch ? { touchAction: 'pan-y' } : undefined}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', () => onFail?.(), { once: true })
      }}
    >
      <StudioLights />
      {touch ? <TouchMark onReady={onReady} /> : <CursorMark onReady={onReady} />}
      <GroundGlow />
    </Canvas>
  )
}
