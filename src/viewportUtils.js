import { colorScheme } from "./colorScheme"
import * as THREE from "three"
import CameraControls from "camera-controls"

CameraControls.install({ THREE: THREE })

const PI = 3.1415926

const bluetiful = 0x0366fc
// const verdigris = 0x48a9a6
// const redSalsa = 0xff595e
// const jonquil = 0xf7cb15
// const white = 0xffffff

export const planeMaterial = new THREE.MeshPhongMaterial({
  color: colorScheme.plane,
  side: THREE.DoubleSide,
  depthWrite: false,
  transparent: true,
  opacity: 0.1,
})

export const planeHoverMaterial = new THREE.MeshPhongMaterial({
  color: colorScheme.mouseOver,
  side: THREE.DoubleSide,
  depthWrite: false,
  transparent: true,
  opacity: 0.3,
})

export const planeSelectedMaterial = new THREE.MeshPhongMaterial({
  color: colorScheme.selected,
  side: THREE.DoubleSide,
  depthWrite: false,
  transparent: true,
  opacity: 0.3,
})

export function initScene(canvasID) {
  const canvas = document.getElementById(canvasID)
  const scene = new THREE.Scene()

  const w = canvas.getBoundingClientRect().width
  const h = canvas.getBoundingClientRect().height
  const camera = new THREE.PerspectiveCamera(5, w / h, 0.01, 1000)

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true })
  renderer.setClearColor(0xffffff, 0)
  renderer.setSize(w, h)

  // xy is top
  // xz is front
  // yz is right

  // SET UP CAMERA
  const cscale = 12
  camera.position.y = 1 * cscale
  camera.position.x = 0.6 * cscale
  camera.position.z = 0.25 * cscale
  camera.up.set(0, 0, 1)

  // ADD CONTROLS
  // const controls = new OrbitControls(camera, renderer.domElement)
  const clock = new THREE.Clock()
  const cameraControls = new CameraControls(camera, renderer.domElement)
  cameraControls.mouseButtons.left = CameraControls.ACTION["NONE"]
  cameraControls.mouseButtons.middle = CameraControls.ACTION["DOLLY"]
  cameraControls.mouseButtons.wheel = CameraControls.ACTION["DOLLY"]
  cameraControls.mouseButtons.right = CameraControls.ACTION["ROTATE"]

  renderer.render(scene, camera)

  return { renderer, camera, scene, cameraControls, clock }
}

export function addLightsToScene(scene) {
  scene.add(new THREE.AmbientLight(0xffffff))

  // Sneak in a little axes helper for now
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)
}

export function addSketchToScene(sketch, scene) {
  const sketchGroup = new THREE.Group()
  for (let pt of sketch.oc_points) {
    const ptGeometry = new THREE.BufferGeometry()
    ptGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([pt.X(), pt.Y(), pt.Z()]), 3)
    )
    const dotMaterial = new THREE.PointsMaterial({
      size: 4,
      color: 0x000000,
      sizeAttenuation: false,
    })
    sketchGroup.add(new THREE.Points(ptGeometry, dotMaterial))
  }

  for (let segment of sketch.oc_segments) {
    const oc_start = segment.StartPoint()
    const oc_end = segment.EndPoint()

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xfaa000,
      linewidth: 1,
    })
    const points = []
    points.push(new THREE.Vector3(oc_start.X(), oc_start.Y(), oc_start.Z()))
    points.push(new THREE.Vector3(oc_end.X(), oc_end.Y(), oc_end.Z()))
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const lineMesh = new THREE.Line(lineGeometry, lineMaterial)
    sketchGroup.add(lineMesh)
  }

  // TODO Add drawing polygons/faces?

  scene.add(sketchGroup)
}

export function addPlaneToScene(plane, scene) {
  // given a plane, add it to the scene and add a backref to the plane
  // so the plane knows its object
  const planeGeometry = new THREE.PlaneGeometry(1, 1)
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  planeMesh.position.set(...plane.origin)
  const normalVector = new THREE.Vector3(...plane.normal)
  planeMesh.lookAt(normalVector)
  scene.add(planeMesh)
  plane.mesh = planeMesh
  planeMesh.docRef = plane

  const lineMaterial = new THREE.LineBasicMaterial({
    color: bluetiful,
    linewidth: 1,
  })
  const points = []
  points.push(new THREE.Vector3(-0.5, -0.5, 0))
  points.push(new THREE.Vector3(-0.5, 0.5, 0))
  points.push(new THREE.Vector3(0.5, 0.5, 0))
  points.push(new THREE.Vector3(0.5, -0.5, 0))
  points.push(new THREE.Vector3(-0.5, -0.5, 0))
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  const lineMesh = new THREE.Line(lineGeometry, lineMaterial)
  lineMesh.position.set(...plane.origin)
  lineMesh.lookAt(normalVector)
  scene.add(lineMesh)
  plane.line = lineMesh
  lineMesh.docRef = plane

  const setSelected = (selected) => {
    console.log("plane is now selected:", selected)
    if (selected) {
      planeMesh.material = planeSelectedMaterial
    } else {
      planeMesh.material = planeMaterial
    }
  }
}

export function addPointToScene(scene) {
  const dotGeometry = new THREE.BufferGeometry()
  dotGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3)
  )
  const dotMaterial = new THREE.PointsMaterial({
    size: 5,
    color: bluetiful,
    sizeAttenuation: false,
  })
  const dot = new THREE.Points(dotGeometry, dotMaterial)
  scene.add(dot)
}
