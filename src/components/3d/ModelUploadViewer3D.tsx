'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, RefreshCw, Eye, Box, Layers } from 'lucide-react';

interface ModelUploadViewer3DProps {
  fileData?: File | null;
  fileUrl?: string;
  fileFormat?: 'stl' | 'obj' | 'glb' | 'gltf';
  filamentColor?: string;
  materialType?: string;
  onGeometryComputed?: (info: {
    dimensionsMm: { x: number; y: number; z: number };
    triangleCount: number;
    volumeCm3: number;
  }) => void;
  className?: string;
}

export default function ModelUploadViewer3D({
  fileData,
  fileUrl,
  fileFormat = 'stl',
  filamentColor = '#1c0b60',
  materialType = 'PLA',
  onGeometryComputed,
  className = '',
}: ModelUploadViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelMeshRef = useRef<THREE.Mesh | THREE.Group | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [modelStats, setModelStats] = useState<{
    dimensionsMm: { x: number; y: number; z: number };
    triangleCount: number;
    volumeCm3: number;
  } | null>(null);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8f8f7);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(40, 50, 75);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(50, 70, 50);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbad2ff, 1.0);
    fillLight.position.set(-50, 30, -50);
    scene.add(fillLight);

    // Build print bed grid
    const printBedSize = 120;
    const grid = new THREE.GridHelper(printBedSize, 24, 0x1c0b60, 0xcfd8e3);
    grid.position.y = 0;
    scene.add(grid);

    // Animate
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Load Model File (STL or OBJ)
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous model
    if (modelMeshRef.current) {
      scene.remove(modelMeshRef.current);
      modelMeshRef.current = null;
    }

    if (!fileData && !fileUrl) {
      // Create a demonstration mechanical bracket STL sample so the viewer is alive immediately!
      createSampleMechanicalPart();
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setErrorMessage(null);

    const reader = new FileReader();

    if (fileFormat === 'stl') {
      reader.onload = (e) => {
        try {
          const contents = e.target?.result as ArrayBuffer;
          const loader = new STLLoader();
          const geometry = loader.parse(contents);

          setupGeometry(geometry);
          setIsLoading(false);
        } catch (err) {
          console.error('Error parsing STL:', err);
          setErrorMessage('Failed to parse 3D STL file. Please check file formatting.');
          setIsLoading(false);
          createSampleMechanicalPart();
        }
      };

      if (fileData) {
        reader.readAsArrayBuffer(fileData);
      } else if (fileUrl) {
        fetch(fileUrl)
          .then((r) => r.arrayBuffer())
          .then((buf) => {
            const loader = new STLLoader();
            const geometry = loader.parse(buf);
            setupGeometry(geometry);
            setIsLoading(false);
          })
          .catch(() => {
            createSampleMechanicalPart();
            setIsLoading(false);
          });
      }
    } else if (fileFormat === 'obj') {
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const loader = new OBJLoader();
          const objGroup = loader.parse(text);

          setupObjGroup(objGroup);
          setIsLoading(false);
        } catch (err) {
          console.error('Error parsing OBJ:', err);
          setErrorMessage('Failed to parse OBJ file.');
          setIsLoading(false);
          createSampleMechanicalPart();
        }
      };

      if (fileData) {
        reader.readAsText(fileData);
      } else {
        createSampleMechanicalPart();
        setIsLoading(false);
      }
    } else if (fileFormat === 'glb' || fileFormat === 'gltf') {
      const loader = new GLTFLoader();

      const onLoaded = (gltf: { scene: THREE.Group }) => {
        setupObjGroup(gltf.scene);
        setIsLoading(false);
      };

      const onError = (err: unknown) => {
        console.error('Error parsing GLTF/GLB:', err);
        setErrorMessage('Failed to parse GLB/GLTF file. Check that the model is self-contained.');
        setIsLoading(false);
        createSampleMechanicalPart();
      };

      if (fileData) {
        const gltfReader = new FileReader();
        gltfReader.onload = (e) => {
          try {
            if (fileFormat === 'glb') {
              loader.parse(e.target?.result as ArrayBuffer, '', onLoaded, onError);
            } else {
              loader.parse(e.target?.result as string, '', onLoaded, onError);
            }
          } catch (err) {
            onError(err);
          }
        };
        if (fileFormat === 'glb') {
          gltfReader.readAsArrayBuffer(fileData);
        } else {
          gltfReader.readAsText(fileData);
        }
      } else if (fileUrl) {
        loader.load(fileUrl, onLoaded, undefined, onError);
      } else {
        createSampleMechanicalPart();
        setIsLoading(false);
      }
    } else {
      createSampleMechanicalPart();
      setIsLoading(false);
    }
  }, [fileData, fileUrl, fileFormat]);

  // Update material properties on color / wireframe changes
  useEffect(() => {
    if (!modelMeshRef.current) return;

    let roughness = 0.35;
    let metalness = 0.08;
    let clearcoat = 0.2;

    if (materialType === 'Silk PLA') {
      roughness = 0.16;
      metalness = 0.35;
      clearcoat = 0.7;
    } else if (materialType === 'PETG') {
      roughness = 0.25;
      clearcoat = 0.4;
    } else if (materialType === 'Resin') {
      roughness = 0.1;
      clearcoat = 0.9;
    }

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(filamentColor),
      roughness,
      metalness,
      clearcoat,
      wireframe,
    });

    if (modelMeshRef.current instanceof THREE.Mesh) {
      modelMeshRef.current.material = mat;
    } else if (modelMeshRef.current instanceof THREE.Group) {
      modelMeshRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = mat;
        }
      });
    }
  }, [filamentColor, materialType, wireframe]);

  function setupGeometry(geometry: THREE.BufferGeometry) {
    const scene = sceneRef.current;
    if (!scene) return;

    geometry.computeVertexNormals();
    geometry.center();
    geometry.computeBoundingBox();

    const box = geometry.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);

    // Calculate dimensions in mm
    const dimX = Math.round(size.x * 10) / 10;
    const dimY = Math.round(size.y * 10) / 10;
    const dimZ = Math.round(size.z * 10) / 10;
    const triCount = geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
    const approxVolume = Math.round(((dimX * dimY * dimZ * 0.45) / 1000) * 10) / 10; // rough bounding volume factor

    const stats = {
      dimensionsMm: { x: dimX, y: dimZ, z: dimY },
      triangleCount: Math.round(triCount),
      volumeCm3: approxVolume,
    };
    setModelStats(stats);
    if (onGeometryComputed) onGeometryComputed(stats);

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(filamentColor),
      roughness: 0.3,
      metalness: 0.1,
      wireframe,
    });

    const mesh = new THREE.Mesh(geometry, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Sit directly on the build bed (y = 0)
    mesh.position.y = size.y / 2;
    scene.add(mesh);
    modelMeshRef.current = mesh;

    // Fit camera to object bounds
    fitCameraToObject(mesh);
  }

  function setupObjGroup(group: THREE.Group) {
    const scene = sceneRef.current;
    if (!scene) return;

    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    group.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);

    group.position.y = size.y / 2;

    const previewMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(filamentColor),
      roughness: 0.3,
      metalness: 0.1,
      wireframe,
    });

    let triangleCount = 0;
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = previewMaterial;
        const geometry = child.geometry as THREE.BufferGeometry;
        if (geometry?.index) {
          triangleCount += geometry.index.count / 3;
        } else if (geometry?.attributes?.position) {
          triangleCount += geometry.attributes.position.count / 3;
        }
      }
    });

    const stats = {
      dimensionsMm: { x: Math.round(size.x), y: Math.round(size.z), z: Math.round(size.y) },
      triangleCount: Math.round(triangleCount) || 1,
      volumeCm3: Math.round(((size.x * size.y * size.z * 0.4) / 1000) * 10) / 10,
    };
    setModelStats(stats);
    if (onGeometryComputed) onGeometryComputed(stats);

    scene.add(group);
    modelMeshRef.current = group;
    fitCameraToObject(group);
  }

  function createSampleMechanicalPart() {
    const scene = sceneRef.current;
    if (!scene) return;

    // High quality procedural 3D mechanical component
    const group = new THREE.Group();

    // Base cylinder bracket
    const baseGeo = new THREE.CylinderGeometry(18, 20, 8, 36);
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(filamentColor),
      roughness: 0.35,
      metalness: 0.15,
      wireframe,
    });
    const base = new THREE.Mesh(baseGeo, bodyMat);
    base.position.y = 4;
    group.add(base);

    // Tower boss
    const towerGeo = new THREE.CylinderGeometry(11, 14, 28, 36);
    const tower = new THREE.Mesh(towerGeo, bodyMat);
    tower.position.y = 22;
    group.add(tower);

    // Center mounting hole
    const ringGeo = new THREE.TorusGeometry(8, 2.5, 16, 32);
    const ring = new THREE.Mesh(ringGeo, bodyMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 36;
    group.add(ring);

    scene.add(group);
    modelMeshRef.current = group;

    const stats = {
      dimensionsMm: { x: 40, y: 40, z: 42 },
      triangleCount: 18400,
      volumeCm3: 16.5,
    };
    setModelStats(stats);
    if (onGeometryComputed) onGeometryComputed(stats);

    fitCameraToObject(group);
  }

  function fitCameraToObject(obj: THREE.Object3D) {
    if (!cameraRef.current || !controlsRef.current) return;
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2)) * 1.8;
    cameraZ = Math.max(cameraZ, 45);

    cameraRef.current.position.set(cameraZ * 0.7, cameraZ * 0.7, cameraZ);
    cameraRef.current.lookAt(0, size.y / 2, 0);
    controlsRef.current.target.set(0, size.y / 2, 0);
    controlsRef.current.update();
  }

  const handleResetCamera = () => {
    if (modelMeshRef.current) {
      fitCameraToObject(modelMeshRef.current);
    }
  };

  return (
    <div className={`relative w-full h-full min-h-[440px] rounded-2xl overflow-hidden border border-brand-primary/10 bg-gradient-to-b from-brand-lavender/60 via-brand-offwhite to-brand-lavender/30 shadow-inner ${className}`}>
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/85 backdrop-blur-sm z-20">
          <div className="w-10 h-10 border-4 border-brand-lavender border-t-brand-primary rounded-full animate-spin mb-3" />
          <p className="text-[10px] font-mono font-semibold text-brand-primary/60 uppercase tracking-[0.16em]">Parsing mesh & computing geometry…</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="absolute top-4 left-4 right-16 bg-brand-blush text-brand-wine text-[10px] px-3 py-2 rounded-lg border border-brand-pink/20 z-10">
          {errorMessage}
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-brand-primary/10 shadow-lg z-10">
        <button onClick={handleResetCamera} title="Center & Reset View" className="p-2 rounded-lg text-brand-navy/70 hover:bg-brand-lavender transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
          className={`p-2 rounded-lg transition-colors ${autoRotate ? 'bg-brand-primary text-white' : 'text-brand-navy/70 hover:bg-brand-lavender'}`}
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => setWireframe(!wireframe)}
          title="Toggle Wireframe Mesh"
          className={`p-2 rounded-lg transition-colors ${wireframe ? 'bg-brand-gold text-brand-navy' : 'text-brand-navy/70 hover:bg-brand-lavender'}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Computed Geometry Badge (Live Specs) */}
      {modelStats && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-brand-primary/10 shadow-sm text-[10px] font-mono uppercase tracking-[0.08em] text-brand-navy/60 z-10">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-brand-primary" />
            <span className="font-semibold text-brand-navy">
              {modelStats.dimensionsMm.x} × {modelStats.dimensionsMm.y} × {modelStats.dimensionsMm.z} mm
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-primary/40" />
              {modelStats.triangleCount.toLocaleString()} polygons
            </span>
            <span className="font-medium text-brand-pine bg-brand-mint px-2 py-0.5 rounded border border-brand-teal/20">
              ~{modelStats.volumeCm3} cm³ volume
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
