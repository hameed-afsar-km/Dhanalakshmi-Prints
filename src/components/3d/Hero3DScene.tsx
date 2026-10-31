'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Hero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 18, 75);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // keep hero zoom disabled for effortless page scrolling
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(40, 50, 45);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe71e64, 1.8); // Accent pink rim light
    rimLight.position.set(-45, -20, -35);
    scene.add(rimLight);

    const goldFill = new THREE.DirectionalLight(0xfed003, 1.2); // Brand gold fill light
    goldFill.position.set(25, -30, 20);
    scene.add(goldFill);

    // Hero Floating Objects Group
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);
    let pointerX = 0;
    let pointerY = 0;
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // The real brand asset is mounted on a deep, printed badge so the logo itself
    // is the hero object rather than an unrelated sample product.
    const plateWidth = 30;
    const plateHeight = 30;
    const plateGeo = new THREE.BoxGeometry(plateWidth, plateHeight, 3.8, 8, 8, 3);
    const plateTex = new THREE.TextureLoader().load('/assets/logo.png');
    plateTex.colorSpace = THREE.SRGBColorSpace;
    plateTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const indigoMat = new THREE.MeshPhysicalMaterial({
      color: 0x1c0b60,
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.5,
    });
    const frontMat = new THREE.MeshPhysicalMaterial({
      map: plateTex,
      roughness: 0.18,
      metalness: 0.08,
      clearcoat: 0.85,
    });

    const plateMesh = new THREE.Mesh(plateGeo, [indigoMat, indigoMat, indigoMat, indigoMat, frontMat, indigoMat]);
    plateMesh.position.set(0, 2, 0);
    plateMesh.rotation.set(0.08, -0.2, 0.08);
    plateMesh.castShadow = true;
    heroGroup.add(plateMesh);

    // A floating orbit and two small material tokens keep the scene playful,
    // without competing with the brand mark.
    const ringGeo = new THREE.TorusGeometry(20, 0.45, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xfed003, metalness: 0.9, roughness: 0.2 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 2, -7);
    ringMesh.rotation.set(0.3, 0.1, 0.4);
    heroGroup.add(ringMesh);

    // 2. Floating 3D Geometric Polyhedron / Diamond (Art Piece)
    const polyGeo = new THREE.IcosahedronGeometry(10, 0);
    const polyMat = new THREE.MeshPhysicalMaterial({
      color: 0xe71e64,
      metalness: 0.2,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.3,
      thickness: 1.5,
    });
    const polyMesh = new THREE.Mesh(polyGeo, polyMat);
    polyMesh.position.set(19, -11, 8);
    polyMesh.rotation.set(0.4, 0.2, 0.5);
    heroGroup.add(polyMesh);

    // 3. Floating Golden Ring
    const torusGeo = new THREE.TorusGeometry(12, 1.2, 16, 48);
    const torusMat = new THREE.MeshStandardMaterial({ color: 0x019c87, metalness: 0.8, roughness: 0.25 });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.position.set(-17, -13, -8);
    torusMesh.rotation.set(1.1, 0.4, 0.2);
    heroGroup.add(torusMesh);

    // Animation loop with gentle floating motion
    const clock = new THREE.Clock();
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating sine motion
      plateMesh.position.y = 2 + Math.sin(elapsed * 1.5) * 1.35;
      plateMesh.rotation.z = 0.08 + Math.cos(elapsed * 1.2) * 0.04;
      heroGroup.rotation.x += (pointerY * -0.12 - heroGroup.rotation.x) * 0.035;
      heroGroup.rotation.y += (pointerX * 0.16 - heroGroup.rotation.y) * 0.035;

      polyMesh.position.y = -10 + Math.cos(elapsed * 1.8) * 2.2;
      polyMesh.rotation.x += 0.008;
      polyMesh.rotation.y += 0.012;

      torusMesh.position.y = -14 + Math.sin(elapsed * 1.4) * 2.0;
      torusMesh.rotation.x += 0.005;
      torusMesh.rotation.z += 0.008;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] rounded-3xl overflow-hidden bg-gradient-to-tr from-slate-100/90 via-indigo-50/40 to-amber-50/30 border border-slate-200/80 shadow-2xl shadow-indigo-950/5">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-500 hover:scale-[1.015]" />
      {/* Floating Badges */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-slate-800 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        Interactive 3D brand mark
      </div>
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-200/80 text-[11px] font-medium text-slate-500 pointer-events-none hidden sm:block">
        Drag the logo to explore it
      </div>
    </div>
  );
}
